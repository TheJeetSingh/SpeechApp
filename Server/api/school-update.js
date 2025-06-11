// Dedicated endpoint for updating user's school with CORS handling
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
    console.log("MongoDB connected in school-update function");
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
  // Most permissive CORS headers possible
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    console.log('SCHOOL_UPDATE: Handling OPTIONS preflight request');
    return res.status(200).end();
  }
  
  console.log('SCHOOL_UPDATE: Request received', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });
  
  // Only accept POST requests for actual updates
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      message: 'Method not allowed',
      allowedMethods: ['POST', 'OPTIONS'] 
    });
  }
  
  try {
    // Connect to database
    await connectToDatabase();
    
    // Verify user authentication
    const user = auth(req);
    console.log('SCHOOL_UPDATE: User authenticated', { userId: user.id });
    
    // Extract school from request body
    const { school } = req.body;
    if (!school) {
      return res.status(400).json({ message: "School name is required" });
    }
    
    // Find and update user
    const userDoc = await User.findById(user.id);
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update school and save
    userDoc.school = school;
    await userDoc.save();
    console.log('SCHOOL_UPDATE: School updated successfully for user', { userId: user.id, school });
    
    // Generate a new token with updated info
    const token = generateToken(userDoc);
    
    // Return success
    return res.status(200).json({
      message: "School updated successfully",
      token,
      user: {
        id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        school: userDoc.school
      }
    });
  } catch (error) {
    console.error('SCHOOL_UPDATE: Error occurred', { error: error.message, stack: error.stack });
    
    if (error.message === 'Authentication required' || error.message === 'Please authenticate.') {
      return res.status(401).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Server error occurred while updating school",
      error: error.message
    });
  }
}; 