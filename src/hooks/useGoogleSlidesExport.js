import { useState } from 'react'

export function useGoogleSlidesExport() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const createSlidesPresentation = async (summary, topic) => {
    setIsLoading(true)
    setError(null)

    try {
      // Call the Netlify function to create the Google Slides presentation
      const response = await fetch('/.netlify/functions/create-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${topic || 'Research'} Summary`,
          summary: summary.conclusion,
          citations: summary.citations || [],
          disclaimer: summary.disclaimer,
          supportingSourceCount: summary.supportingSourceCount,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create presentation: ${response.statusText}`)
      }

      const data = await response.json()

      // Open the Google Slides presentation in a new tab
      if (data.presentationUrl) {
        window.open(data.presentationUrl, '_blank')
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('Error creating Google Slides:', errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createSlidesPresentation,
    isLoading,
    error,
  }
}
