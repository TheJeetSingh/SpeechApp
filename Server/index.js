const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");
const https = require("https");

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({ origin: "*" })); // Adjust origin for security if needed


// Create a custom Axios instance that ignores SSL verification
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Ignore SSL certificate issues
});

app.get('/', (req, res) => {
  res.send('Hello from Vercel!');
});

// Set up a route to fetch news data
app.get("/api/news", async (req, res) => {
  try {
    const response = await axiosInstance.get(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
    );
    res.json(response.data); // Send the API data back to the frontend
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Error fetching news" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
