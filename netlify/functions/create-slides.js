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

    // Create new slides for content
    const newSlides = []

    // Slide 1: Evidence Summary
    const summarySlide = {
      addSlide: {
        slideLayoutReference: { predefinedLayout: 'BLANK' },
      },
    }
    newSlides.push(summarySlide)

    // Slide 2: Supporting Sources & Citations
    if (citations && citations.length > 0) {
      const citationSlide = {
        addSlide: {
          slideLayoutReference: { predefinedLayout: 'BLANK' },
        },
      }
      newSlides.push(citationSlide)
    }

    // Add all new slides
    const addSlidesResponse = await slides.presentations.batchUpdate({
      presentationId,
      requestBody: { requests: newSlides },
    })

    const summarySlideId = addSlidesResponse.data.replies[0].addSlide.slide.objectId

    // Add content to summary slide
    let summaryContent = 'Evidence Summary\n\n' + summary

    if (supportingSourceCount > 0) {
      summaryContent += `\n\nSupporting Sources: ${supportingSourceCount}`
    }

    if (disclaimer) {
      summaryContent += `\n\n⚠️ ${disclaimer}`
    }

    const summaryRequests = [
      {
        insertText: {
          objectId: summarySlideId,
          text: summaryContent,
          insertionIndex: 0,
        },
      },
    ]

    await slides.presentations.batchUpdate({
      presentationId,
      requestBody: { requests: summaryRequests },
    })

    // Add citations to second slide if they exist
    if (citations && citations.length > 0) {
      const citationSlideId = addSlidesResponse.data.replies[1].addSlide.slide.objectId

      let citationContent = 'Cited References\n\n'
      citations.forEach((c, idx) => {
        citationContent += `[${idx + 1}] ${c.title}\n`
        citationContent += `Authors: ${c.authors}\n`
        citationContent += `Type: ${c.type}\n`
        citationContent += `URL: ${c.url}\n\n`
      })

      const citationRequests = [
        {
          insertText: {
            objectId: citationSlideId,
            text: citationContent,
            insertionIndex: 0,
          },
        },
      ]

      await slides.presentations.batchUpdate({
        presentationId,
        requestBody: { requests: citationRequests },
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
