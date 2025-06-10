const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected in serverless function");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Database connection failed");
  }
};

// Define User Schema if it doesn't exist
let User;
try {
  User = mongoose.model("User");
} catch {
  const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    school: String
  });
  User = mongoose.model("User", UserSchema);
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, name: user.name, email: user.email, school: user.school }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Auth middleware
const auth = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Please authenticate.');
  }
};

// Serverless function handler
module.exports = async (req, res) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://speech-app-delta.vercel.app',
    'https://speech-app-server.vercel.app',
    'https://www.articulate.ninja'
  ];

  const origin = req.headers.origin;
  console.log('Incoming Origin:', origin);

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin'); // For caching proxies
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Always respond to OPTIONS with CORS headers
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  console.log('School update request received');
  
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Authenticate user
    const user = auth(req);
    
    const { school } = req.body;
    if (!school) {
      return res.status(400).json({ message: "School is required" });
    }

    // Find and update user
    const userDoc = await User.findById(user.id);
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    userDoc.school = school;
    await userDoc.save();

    // Generate a new token with the updated school information
    const token = generateToken(userDoc);
    res.json({ message: "School updated successfully", token });
  } catch (error) {
    console.error("Error updating school:", error);
    
    if (error.message === 'Authentication required' || error.message === 'Please authenticate.') {
      return res.status(401).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
}; 