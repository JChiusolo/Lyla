const { google } = require('googleapis')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const { title, summary, citations, disclaimer, supportingSourceCount, accessToken } = JSON.parse(event.body)

    if (!accessToken) {
      return { statusCode: 401, body: JSON.stringify({ error: 'No access token' }) }
    }

    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken })

    const slides = google.slides({ version: 'v1', auth })

    // Create presentation
    const presentation = await slides.presentations.create({ requestBody: { title } })
    const presentationId = presentation.data.presentationId
    const pageId = presentation.data.slides[0].objectId
    const titleBoxId = presentation.data.slides[0].pageElements[0].objectId

    // Simple approach - just add text to existing title box
    const requests = [
      {
        updateTextStyle: {
          objectId: titleBoxId,
          fields: '*',
          style: { fontSize: { magnitude: 32, unit: 'PT' } },
        },
      },
      {
        insertText: {
          objectId: titleBoxId,
          text: title,
          insertionIndex: 0,
        },
      },
    ]

    // Execute batch update
    await slides.presentations.batchUpdate({
      presentationId,
      requestBody: { requests },
    })

    // Now add new slides for content
    const addSlideRequests = [
      {
        addSlide: {
          slideLayoutReference: { predefinedLayout: 'BLANK' },
        },
      },
    ]

    const addSlideResponse = await slides.presentations.batchUpdate({
      presentationId,
      requestBody: { requests: addSlideRequests },
    })

    const newSlideId = addSlideResponse.data.replies[0].addSlide.slide.objectId

    // Add content to new slide
    const contentRequests = [
      {
        insertText: {
          objectId: newSlideId,
          text: 'Evidence Summary\n\n' + summary,
          insertionIndex: 0,
        },
      },
    ]

    if (supportingSourceCount > 0) {
      contentRequests.push({
        insertText: {
          objectId: newSlideId,
          text: '\n\nSupporting Sources: ' + supportingSourceCount,
          insertionIndex: 0,
        },
      })
    }

    if (citations && citations.length > 0) {
      let citationText = '\n\nCited References:\n\n'
      citations.forEach((c, idx) => {
        citationText += `[${idx + 1}] ${c.title}\nAuthors: ${c.authors}\nType: ${c.type}\n\n`
      })

      contentRequests.push({
        insertText: {
          objectId: newSlideId,
          text: citationText,
          insertionIndex: 0,
        },
      })
    }

    if (disclaimer) {
      contentRequests.push({
        insertText: {
          objectId: newSlideId,
          text: '\n\n⚠️ Disclaimer: ' + disclaimer,
          insertionIndex: 0,
        },
      })
    }

    await slides.presentations.batchUpdate({
      presentationId,
      requestBody: { requests: contentRequests },
    })

    const presentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`

    return {
      statusCode: 200,
      body: JSON.stringify({ presentationId, presentationUrl }),
    }
  } catch (error) {
    console.error('Error:', error.message)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
