exports.handler = async (event) => {
  console.log('Exchange token function called')
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { code } = JSON.parse(event.body)
    console.log('Authorization code received')

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No authorization code provided' }),
      }
    }

    const clientId = '45893805451-5jj3mimasahbc9v1baegis10e19db2ps.apps.googleusercontent.com'
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = 'https://lyla-chiusolo-medinfo.netlify.app/auth/callback'

    if (!clientSecret) {
      console.error('GOOGLE_CLIENT_SECRET not set')
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing GOOGLE_CLIENT_SECRET environment variable' }),
      }
    }

    console.log('Exchanging code for token')
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }).toString(),
    })

    const data = await response.json()
    console.log('Token response received:', data.error ? 'ERROR' : 'SUCCESS')

    if (data.error) {
      console.error('Token exchange error:', data.error, data.error_description)
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: data.error,
          error_description: data.error_description 
        }),
      }
    }

    console.log('Access token obtained successfully')
    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: data.access_token,
        token_type: data.token_type,
        expires_in: data.expires_in,
      }),
    }
  } catch (error) {
    console.error('Token exchange error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to exchange token',
        message: error.message,
      }),
    }
  }
}
