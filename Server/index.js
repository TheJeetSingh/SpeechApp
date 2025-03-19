const express = require("express");
const cors = require("cors"); // Import cors
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Specific origins to allow
const allowedOrigins = [
  'http://localhost:3000',
  'https://speech-app-delta.vercel.app'
];

// CORS middleware for all routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  } else {
    res.header('Access-Control-Allow-Origin', '*'); // Fallback to allow all origins
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Also keep the cors middleware for compatibility
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      // Allow all origins as fallback
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  optionsSuccessStatus: 200,
  credentials: false
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Parse JSON request bodies with increased limit for audio data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

// Secret Key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Routes

// Root Route (To Check If Backend is Running)
app.get("/", (req, res) => {
  res.send("Welcome to the Impromptu App Server!");
});

// CORS Test Endpoint
app.get("/api/cors-test", (req, res) => {
  // Set CORS headers explicitly on this route
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  res.json({ 
    message: "CORS is working correctly!", 
    origin: origin,
    headers: {
      received: {
        origin: req.headers.origin,
        host: req.headers.host,
        referer: req.headers.referer
      },
      sent: {
        'access-control-allow-origin': res.getHeader('Access-Control-Allow-Origin'),
        'access-control-allow-methods': res.getHeader('Access-Control-Allow-Methods'),
        'access-control-allow-headers': res.getHeader('Access-Control-Allow-Headers')
      }
    },
    server_time: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'not set'
  });
});

// Signup Route
app.post("/api/signup", async (req, res) => {
  // Set CORS headers directly on this route
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  const { name, email, password } = req.body;

  // Manual input validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(newUser);
    res.json({ token, name: newUser.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while signing up" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  // Set CORS headers directly on this route
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while logging in" });
  }
});

// Protected Route Example
app.get("/protected", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: "Access granted", user: decoded });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// News API Route
app.get("/api/news", async (req, res) => {
  // Set CORS headers directly on this route
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
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
      res.json({ articles: response.data.articles });
    } else {
      console.log("No articles found from News API");
      res.status(404).json({ message: "No articles found" });
    }
  } catch (err) {
    console.error("News API Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching news", error: err.message });
  }
});

// Speech Analysis API Route with Gemini
app.post("/api/analyze-speech", async (req, res) => {
  // Set CORS headers directly on this route
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  const { audio, topic, speechType, speechContext, duration, mimeType } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error("Gemini API key is missing");
    return res.status(500).json({ 
      message: "Server configuration error: API key is missing",
      error: "API_KEY_MISSING"
    });
  }

  if (!audio) {
    console.error("Audio data is missing in request");
    return res.status(400).json({ 
      message: "Audio data is required",
      error: "AUDIO_MISSING"
    });
  }

  // Validate audio data is properly formatted
  try {
    // Simple validation for base64 data
    if (!/^[A-Za-z0-9+/=]+$/.test(audio)) {
      console.error("Invalid audio data format");
      return res.status(400).json({
        message: "Invalid audio data format",
        error: "INVALID_AUDIO_FORMAT"
      });
    }

    // Convert speech duration to minutes and seconds for context
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Determine audio MIME type (ensure it's supported)
    let audioMimeType = mimeType || "audio/webm";
    
    // Map to supported MIME types if needed
    if (audioMimeType === "audio/webm") {
      // Gemini supports these formats directly
      console.log("Using webm audio format");
    } else {
      // Default to a supported format
      console.log(`Converting ${audioMimeType} to audio/mp3 for compatibility`);
      audioMimeType = "audio/mp3";
    }
    
    console.log(`Processing audio with MIME type: ${audioMimeType}`);
    
    // Prepare the prompt for Gemini with additional context
    const contextIntro = speechContext ? speechContext : 
      `This is a ${speechType || "speech"} on the topic: "${topic || "Unknown"}". `;
      
    // Log speech type and topic for debugging
    console.log(`Speech type: ${speechType}, Topic: ${topic}`);
    
    const promptText = `
    You are a professional speech coach analyzing an audio recording of a speech.
    
    ${contextIntro}
    The speech duration was: ${formattedDuration}.
    
    First, determine if this is actually a coherent speech or just random noise, background sounds, or gibberish. If it's not a coherent speech (like someone pointing their foot at the microphone, making random noises, or complete silence), respond with a JSON that has:
    - very low scores (below 20)
    - blunt but humorous feedback that the user wasn't even trying
    - a "poorQuality" field set to true
    
    If it IS a coherent speech, provide a comprehensive analysis including:
    
    1. Content analysis: What was the speech about? Was the content well-structured and informative?
    2. Delivery analysis: Assess voice modulation, pacing, clarity, pauses, and overall delivery style.
    3. Give a content score from 0-100.
    4. Give a delivery score from 0-100.
    5. Provide 3-5 specific strengths of the speech.
    6. Provide 3-5 areas for improvement.
    7. Write a 2-3 sentence summary of your overall feedback.
    
    ${speechType === "Impromptu" ? "For impromptu speeches, focus on creativity, quick thinking, and relevance to the assigned topic." : ""}
    ${speechType === "Extemporaneous" ? "For extemporaneous speeches, focus on evidence, organization, and argument quality." : ""}
    
    Format your response as a JSON object with the following keys:
    {
      "topic": "brief description of what the speech was about",
      "contentScore": number,
      "deliveryScore": number,
      "strengths": ["strength1", "strength2", "strength3"],
      "improvements": ["area1", "area2", "area3"],
      "feedback": "overall feedback summary",
      "poorQuality": boolean (true if the audio wasn't a real speech)
    }
    `;

    console.log("Sending request to Gemini API...");
    
    // Call Gemini API with the multimodal content (text + audio)
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: promptText
              },
              {
                inline_data: {
                  mime_type: audioMimeType,
                  data: audio
                }
              }
            ]
          }
        ],
        generation_config: {
          temperature: 0.2,
          max_output_tokens: 1024,
          top_p: 0.8,
          top_k: 40
        }
      },
      {
        timeout: 120000, // 2 minute timeout
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("Received response from Gemini API");
    
    // Extract the text response
    if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
      console.error("Empty response from Gemini API");
      throw new Error("Empty response from AI service");
    }
    
    const textResponse = response.data.candidates[0].content.parts[0].text;
    console.log("Raw response:", textResponse.substring(0, 200) + "...");
    
    // Extract the JSON from the text response
    const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) || 
                     textResponse.match(/{[\s\S]*?}/);
    
    let analysisJson;
    if (jsonMatch) {
      // Clean up the JSON string
      const jsonStr = jsonMatch[0].replace(/```json\n|```/g, '').trim();
      try {
        analysisJson = JSON.parse(jsonStr);
        console.log("Successfully parsed analysis JSON");
      } catch (jsonError) {
        console.error("Error parsing analysis JSON:", jsonError);
        throw new Error("Failed to parse analysis result");
      }
    } else {
      console.warn("Could not extract JSON from response, using fallback");
      // Update the fallback analysis JSON in case of parsing errors
      analysisJson = {
        topic: "Analysis could not determine the speech topic precisely",
        contentScore: 15,
        deliveryScore: 10,
        strengths: ["You attempted to record a speech", "You're using tools to improve your speaking skills"],
        improvements: ["Improve audio quality for better analysis", "Ensure you're actually giving a coherent speech", "Speak clearly and directly into the microphone"],
        feedback: "We couldn't analyze your speech properly. Either the audio quality was too poor or no coherent speech was detected.",
        poorQuality: true
      };
    }

    console.log("Sending analysis back to client");
    res.json(analysisJson);
  } catch (err) {
    // Detailed error logging
    console.error("Speech analysis error:");
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API error response:", err.response.status);
      console.error("API error data:", JSON.stringify(err.response.data, null, 2));
      res.status(500).json({ 
        message: `Error from AI service: ${err.response.status}`,
        error: "API_ERROR",
        details: err.response.data
      });
    } else if (err.request) {
      // The request was made but no response was received
      console.error("No response received:", err.request);
      res.status(500).json({ 
        message: "No response received from AI service",
        error: "API_TIMEOUT"
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request error:", err.message);
      res.status(500).json({ 
        message: `Error analyzing speech: ${err.message}`,
        error: "PROCESSING_ERROR",
        contentScore: 15,
        deliveryScore: 10,
        strengths: ["Your attempt to practice public speaking", "Using the application for improvement"],
        improvements: ["Try recording with clearer audio", "Ensure proper internet connectivity for analysis", "Make sure you're actually speaking during the recording"],
        feedback: "We encountered an error while analyzing your speech. The recording may have been inaudible or contained no actual speech.",
        poorQuality: true
      });
    }
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred on the server',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

// For Vercel serverless environment - export the Express app
module.exports = app;

// Only listen on a port if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
