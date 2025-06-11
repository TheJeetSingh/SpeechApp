// Serverless function handler
module.exports = async (req, res) => {
  // CORS is now handled by the main Express app in Server/index.js

  // Only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 