exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { code } = JSON.parse(event.body)

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No authorization code provided' }),
      }
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: '45893805451-5jj3mimasahbc9v1baegis10e19db2ps.apps.googleusercontent.com',
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'https://lyla-chiusolo-medinfo.netlify.app/auth/callback',
      }),
    })

    const data = await response.json()

    if (data.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data.error_description }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: data.access_token,
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
