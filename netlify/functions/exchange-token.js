exports.handler = async (event) => {
  console.log('=== Exchange Token Function Started ===')
  console.log('Method:', event.httpMethod)
  console.log('Body:', event.body ? 'Present' : 'Missing')

  if (event.httpMethod !== 'POST') {
    console.log('Wrong method, returning 405')
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    let body
    try {
      body = JSON.parse(event.body)
    } catch (e) {
      console.error('Failed to parse body:', e.message)
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON body' }),
      }
    }

    const { code } = body
    console.log('Code received:', code ? 'YES' : 'NO')

    if (!code) {
      console.log('No code in request')
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No authorization code provided' }),
      }
    }

    const clientId = '45893805451-5jj3mimasahbc9v1baegis10e19db2ps.apps.googleusercontent.com'
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = 'https://lyla-chiusolo-medinfo.netlify.app/auth/callback'

    if (!clientSecret) {
      console.error('MISSING ENVIRONMENT VARIABLE: GOOGLE_CLIENT_SECRET')
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing GOOGLE_CLIENT_SECRET environment variable' }),
      }
    }

    console.log('Making token request to Google')
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
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

    console.log('Google token response status:', tokenResponse.status)
    const tokenData = await tokenResponse.json()
    console.log('Token data keys:', Object.keys(tokenData))

    if (tokenData.error) {
      console.error('Google returned error:', tokenData.error, tokenData.error_description)
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: tokenData.error,
          error_description: tokenData.error_description,
        }),
      }
    }

    if (!tokenData.access_token) {
      console.error('No access token in response')
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No access token returned' }),
      }
    }

    console.log('SUCCESS: Access token obtained')
    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: tokenData.access_token,
        token_type: tokenData.token_type || 'Bearer',
        expires_in: tokenData.expires_in,
      }),
    }
  } catch (error) {
    console.error('CAUGHT ERROR:', error.message)
    console.error('Stack:', error.stack)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to exchange token',
        message: error.message,
      }),
    }
  }
}
