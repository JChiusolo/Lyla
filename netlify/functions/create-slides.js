const { google } = require('googleapis')

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { title, summary, citations, disclaimer, supportingSourceCount, accessToken } = JSON.parse(event.body)

    console.log('Received request with title:', title)
    console.log('Access token present:', !!accessToken)

    if (!accessToken) {
      console.log('No access token')
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'No access token provided' }),
      }
    }

    try {
      const auth = new google.auth.OAuth2()
      auth.setCredentials({
        access_token: accessToken,
      })

      console.log('Creating Slides client')
      const slides = google.slides({ version: 'v1', auth })

      console.log('Creating presentation')
      const presentation = await slides.presentations.create({
        requestBody: { title },
      })

      const presentationId = presentation.data.presentationId
      console.log('Presentation created:', presentationId)

      const pageId = presentation.data.slides[0].objectId

      const requests = [
        {
          insertText: {
            objectId: presentation.data.slides[0].pageElements[0].objectId,
            text: title,
            insertionIndex: 0,
          },
        },
        {
          createTextBox: {
            elementProperties: {
              pageObjectId: pageId,
              size: { width: { magnitude: 9, unit: 'INCHES' }, height: { magnitude: 0.5, unit: 'INCHES' } },
              transform: {
                scaleX: 1,
                scaleY: 1,
                translateX: { magnitude: 0.5, unit: 'INCHES' },
                translateY: { magnitude: 1.5, unit: 'INCHES' },
                unit: 'INCHES',
              },
            },
            text: 'Evidence Summary',
          },
        },
        {
          createTextBox: {
            elementProperties: {
              pageObjectId: pageId,
              size: { width: { magnitude: 9, unit: 'INCHES' }, height: { magnitude: 2.5, unit: 'INCHES' } },
              transform: {
                scaleX: 1,
                scaleY: 1,
                translateX: { magnitude: 0.5, unit: 'INCHES' },
                translateY: { magnitude: 2.1, unit: 'INCHES' },
                unit: 'INCHES',
              },
            },
            text: summary || 'No summary available',
          },
        },
      ]

      if (supportingSourceCount > 0) {
        requests.push({
          createTextBox: {
            elementProperties: {
              pageObjectId: pageId,
              size: { width: { magnitude: 9, unit: 'INCHES' }, height: { magnitude: 0.3, unit: 'INCHES' } },
              transform: {
                scaleX: 1,
                scaleY: 1,
                translateX: { magnitude: 0.5, unit: 'INCHES' },
                translateY: { magnitude: 4.7, unit: 'INCHES' },
                unit: 'INCHES',
              },
            },
            text: `Supporting Sources: ${supportingSourceCount}`,
          },
        })
      }

      if (citations && citations.length > 0) {
        requests.push({
          createTextBox: {
            elementProperties: {
              pageObjectId: pageId,
              size: { width: { magnitude: 9, unit: 'INCHES' }, height: { magnitude: 0.5, unit: 'INCHES' } },
              transform: {
                scaleX: 1,
                scaleY: 1,
                translateX: { magnitude: 0.5, unit: 'INCHES' },
                translateY: { magnitude: 5.5, unit: 'INCHES' },
                unit: 'INCHES',
              },
            },
            text: 'Cited References',
          },
        })

        const citationsPerSlide = 3
        for (let i = 0; i < citations.length; i += citationsPerSlide) {
          const batch = citations.slice(i, i + citationsPerSlide)
          const text = batch
            .map((c, idx) => `[${i + idx + 1}] ${c.title}\nAuthors: ${c.authors}\nType: ${c.type}`)
            .join('\n\n---\n\n')

          requests.push({
            createTextBox: {
              elementProperties: {
                pageObjectId: pageId,
                size: { width: { magnitude: 9, unit: 'INCHES' }, height: { magnitude: 6, unit: 'INCHES' } },
                transform: {
                  scaleX: 1,
                  scaleY: 1,
                  translateX: { magnitude: 0.5, unit: 'INCHES' },
                  translateY: { magnitude: 0.5, unit: 'INCHES' },
                  unit: 'INCHES',
                },
              },
              text: text,
            },
          })
        }
      }

      if (disclaimer) {
        requests.push({
          createTextBox: {
            elementProperties: {
              pageObjectId: pageId,
              size: { width: { magnitude: 9, unit: 'INCHES' }, height: { magnitude: 1, unit: 'INCHES' } },
              transform: {
                scaleX: 1,
                scaleY: 1,
                translateX: { magnitude: 0.5, unit: 'INCHES' },
                translateY: { magnitude: 7, unit: 'INCHES' },
                unit: 'INCHES',
              },
            },
            text: `⚠️ Disclaimer: ${disclaimer}`,
          },
        })
      }

      console.log('Batch updating with', requests.length, 'requests')
      await slides.presentations.batchUpdate({
        presentationId,
        requestBody: { requests },
      })

      const presentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`

      console.log('Success! URL:', presentationUrl)
      return {
        statusCode: 200,
        body: JSON.stringify({ presentationId, presentationUrl }),
      }
    } catch (apiError) {
      console.error('API Error:', apiError.message)
      console.error('API Error code:', apiError.code)
      console.error('API Error status:', apiError.status)
      throw apiError
    }
  } catch (error) {
    console.error('Handler error:', error.message)
    console.error('Full error:', JSON.stringify(error, null, 2))
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        details: error.code || error.status,
      }),
    }
  }
}
