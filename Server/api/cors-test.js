// Special Vercel serverless function for CORS testing
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Return a detailed response with CORS diagnostic information
  res.status(200).json({
    message: "CORS test successful from serverless function",
    origin: req.headers.origin || 'No origin header',
    headers: req.headers,
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    cors_headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    }
  });
}; 