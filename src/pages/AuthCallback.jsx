import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    
    if (code) {
      console.log('Authorization code received, exchanging...')
      exchangeCodeForToken(code)
    } else {
      navigate('/search')
    }
  }, [searchParams, navigate])

  const exchangeCodeForToken = async (code) => {
    try {
      console.log('Calling exchange-token function')
      const response = await fetch('/.netlify/functions/exchange-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      console.log('Exchange response status:', response.status)
      const data = await response.json()
      console.log('Exchange response data:', data)
      
      if (data.access_token) {
        console.log('Access token received, storing...')
        localStorage.setItem('google_access_token', data.access_token)
        localStorage.setItem('token_type', data.token_type || 'Bearer')
        navigate('/search')
      } else {
        console.error('No access token in response:', data)
        navigate('/search')
      }
    } catch (error) {
      console.error('Token exchange failed:', error)
      navigate('/search')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg font-semibold">Signing in...</p>
      </div>
    </div>
  )
}
