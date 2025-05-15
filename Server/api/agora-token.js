const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

/**
 * Generate an Agora RTC token for secure video/audio communication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateRtcToken = (req, res) => {
  // Set CORS headers - be more permissive in development
  const origin = req.headers.origin || '*';
  
  // Always allow localhost in development
  if (process.env.NODE_ENV === 'development' || origin.includes('localhost')) {
    console.log('Development mode or localhost detected - allowing all origins');
    res.header('Access-Control-Allow-Origin', '*');
  } else {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Log the request details
  console.log('Token request received:');
  console.log('- Origin:', req.headers.origin);
  console.log('- Environment:', process.env.NODE_ENV || 'not set');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.status(200).end();
  }

  // Get request parameters
  const { channelName, uid, role, expirationTimeInSeconds = 3600 } = req.body;
  
  console.log("Generating Agora token for:", { channelName, uid, role, expirationTimeInSeconds });
  console.log("Request headers:", req.headers);
  
  // Input validation
  if (!channelName) {
    return res.status(400).json({ error: 'Channel name is required' });
  }
  
  // Get Agora credentials from environment variables
  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  
  if (!appID || !appCertificate) {
    console.error('Agora credentials not found in environment variables');
    return res.status(500).json({ error: 'Agora credentials not configured' });
  }
  
  // Set role
  const userRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  
  // Set expiration time
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  
  // Generate the token
  let token;
  try {
    // Ensure uid is a number for token generation
    const tokenUid = typeof uid === 'string' ? parseInt(uid, 10) : (uid || 0);
    
    console.log(`Building token with uid: ${tokenUid}, appID: ${appID.substring(0, 8)}..., channel: ${channelName}`);
    
    token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      tokenUid,
      userRole,
      privilegeExpiredTs
    );
    
    // Verify token format (should start with "006" for Agora tokens)
    if (!token || !token.startsWith('006')) {
      console.error('Generated invalid token format:', token ? token.substring(0, 10) + '...' : 'null');
      return res.status(500).json({ error: 'Failed to generate valid token' });
    }
    
    console.log(`Token generated successfully for channel: ${channelName}`);
    console.log(`Token format check: starts with '006'? ${token.startsWith('006')}`);
    
    // Return the token
    return res.json({ 
      token,
      uid: tokenUid,
      channelName,
      expiresAt: new Date(privilegeExpiredTs * 1000).toISOString()
    });
  } catch (error) {
    console.error('Error generating Agora token:', error);
    return res.status(500).json({ error: 'Failed to generate token', details: error.message });
  }
};

module.exports = { generateRtcToken }; 