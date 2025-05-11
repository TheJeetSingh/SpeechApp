// Import the axios library for making HTTP requests
const axios = require('axios');

// Load environment variables
require('dotenv').config();

// Special Vercel serverless function handler
module.exports = async (req, res) => {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', 'https://speech-app-delta.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log('News API OPTIONS request received');
    return res.status(200).end();
  }
  
  // Only handle GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  console.log('News API request received');
  
  const API_KEY = process.env.NEWS_API_KEY;
  const category = req.query.category || "general";

  if (!API_KEY) {
    return res.status(500).json({ message: "News API key is missing" });
  }

  try {
    console.log(`Fetching news from newsapi.org for category: ${category}`);
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        category,
        country: "us",
        apiKey: API_KEY,
      },
    });

    if (response.data.articles.length > 0) {
      console.log(`Successfully fetched ${response.data.articles.length} articles`);
      res.status(200).json({ articles: response.data.articles });
    } else {
      console.log("No articles found from News API");
      res.status(404).json({ message: "No articles found" });
    }
  } catch (err) {
    console.error("News API Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching news", error: err.message });
  }
}; 