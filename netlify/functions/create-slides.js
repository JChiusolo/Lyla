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
    const presentation = await slides.presentations.create({ 
      requestBody: { title } 
    })
    const presentationId = presentation.data.presentationId

    // Get first slide
    const slideData = await slides.presentations.get({ presentationId })
    const firstSlide = slideData.data.slides[0]
    const firstSlideId = firstSlide.objectId
    let textBoxId = firstSlide.pageElements?.[0]?.objectId

    // Add title to first slide
    const titleRequests = []
    if (textBoxId) {
      titleRequests.push({
        insertText: {
          objectId: textBoxId,
          text: title,
          insertionIndex: 0,
        },
      })
    }

    if (titleRequests.length > 0) {
      await slides.presentations.batchUpdate({
        presentationId,
        requestBody: { requests: titleRequests },
      })
    }

    // Prepare requests for adding new slides with content
    const requests = []

    // Add summary slide
    requests.push({
      createSlide: {
        objectId: 'summary_slide',
        slideLayoutReference: { predefinedLayout: 'BLANK' },
        placeholderIdMappings: [],
      },
    })

    // Add citations slide if citations exist
    if (citations && citations.length > 0) {
      requests.push({
        createSlide: {
          objectId: 'citations_slide',
          slideLayoutReference: { predefinedLayout: 'BLANK' },
          placeholderIdMappings: [],
        },
      })
    }

    const createSlidesResponse = await slides.presentations.batchUpdate({
      presentationId,
      requestBody: { requests },
    })

    // Now add content to the new slides
    const contentRequests = []

    // Summary slide content
    let summaryContent = 'Evidence Summary\n\n' + summary

    if (supportingSourceCount > 0) {
      summaryContent += `\n\nSupporting Sources: ${supportingSourceCount}`
    }

    if (disclaimer) {
      summaryContent += `\n\n⚠️ ${disclaimer}`
    }

    contentRequests.push({
      insertText: {
        objectId: 'summary_slide',
        text: summaryContent,
        insertionIndex: 0,
      },
    })

    // Citations slide content
    if (citations && citations.length > 0) {
      let citationContent = 'Cited References\n\n'
      citations.forEach((c, idx) => {
        citationContent += `[${idx + 1}] ${c.title}\n`
        citationContent += `Authors: ${c.authors}\n`
        citationContent += `Type: ${c.type}\n\n`
      })

      contentRequests.push({
        insertText: {
          objectId: 'citations_slide',
          text: citationContent,
          insertionIndex: 0,
        },
      })
    }

    if (contentRequests.length > 0) {
      await slides.presentations.batchUpdate({
        presentationId,
        requestBody: { requests: contentRequests },
      })
    }

    const presentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        presentationId, 
        presentationUrl,
      }),
    }
  } catch (error) {
    console.error('Error:', error.message)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
