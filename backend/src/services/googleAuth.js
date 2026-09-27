const { OAuth2Client } = require('google-auth-library');
const config = require('../config');

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

/**
 * Verify Google ID Token using official google-auth-library.
 * Adheres strictly to Section 42:
 * "Backend must verify the Google credential. Never trust frontend: email, name, googleId."
 * "If credentials are missing: show a clear configuration message. Do NOT create fake login."
 */
async function verifyGoogleToken(token) {
  if (!token) {
    throw new Error('Google credential token is missing. Please sign in with your Google account.');
  }

  if (!config.GOOGLE_CLIENT_ID || config.GOOGLE_CLIENT_ID.includes('your_google_oauth_client_id_here')) {
    throw new Error(
      'Google OAuth 2.0 is not configured on the server. Please set a valid GOOGLE_CLIENT_ID in the backend environment (.env).'
    );
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new Error('Google token payload missing verified email address.');
    }

    return {
      email: payload.email.toLowerCase().trim(),
      name: payload.name || payload.given_name || 'Festival Participant',
      picture: payload.picture || null,
      googleId: payload.sub
    };
  } catch (err) {
    // If user provided a token that failed Google's cryptographic verification
    console.error('Google token verification error:', err.message);
    throw new Error(`Google authentication failed: ${err.message}`);
  }
}

module.exports = { verifyGoogleToken };
