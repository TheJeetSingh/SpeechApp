// Import the axios library for making HTTP requests
const axios = require('axios');

// Load environment variables
require('dotenv').config();

// Special Vercel serverless function handler
module.exports = async (req, res) => {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log('NYT News API OPTIONS request received');
    return res.status(200).end();
  }
  
  // Only handle GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  console.log('NYT News API request received');
  
  const API_KEY = process.env.NYT_API_KEY;
  const section = req.query.section || "home";

  if (!API_KEY) {
    return res.status(500).json({ message: "NYT API key is missing" });
  }

  try {
    console.log(`Fetching news from NYT API for section: ${section}`);
    const response = await axios.get(`https://api.nytimes.com/svc/topstories/v2/${section}.json`, {
      params: {
        'api-key': API_KEY
      }
    });

    if (response.data.results && response.data.results.length > 0) {
      console.log(`Successfully fetched ${response.data.results.length} articles from NYT`);
      res.status(200).json({ results: response.data.results });
    } else {
      console.log("No articles found from NYT API");
      res.status(404).json({ message: "No articles found" });
    }
  } catch (err) {
    console.error("NYT API Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching news from NYT", error: err.message });
  }
}; 