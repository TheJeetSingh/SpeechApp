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
  console.log('Generating token in user-school with data:', {
    id: user._id,
    name: user.name,
    email: user.email,
    school: user.school || ''
  });
  
  return jwt.sign({ 
    id: user._id, 
    name: user.name, 
    email: user.email, 
    school: user.school || '' 
  }, JWT_SECRET, {
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

// Handler for the /api/user/school endpoint
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request for /api/user/school');
    return res.status(200).end();
  }
  
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  console.log('/api/user/school: Processing request');
  console.log('Headers:', JSON.stringify(req.headers));
  
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Authenticate the user
    let user;
    try {
      user = auth(req);
      console.log('User authenticated:', user);
    } catch (error) {
      console.error('Authentication error:', error.message);
      return res.status(401).json({ message: error.message });
    }
    
    // Extract school from request body
    const { school } = req.body;
    if (!school) {
      return res.status(400).json({ message: 'School name is required' });
    }
    
    // Find and update the user
    const userDoc = await User.findById(user.id);
    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update school
    userDoc.school = school;
    await userDoc.save();
    console.log('School updated successfully:', school);
    
    // Generate a new token with updated school
    const token = generateToken(userDoc);
    
    // Return success response
    return res.status(200).json({
      message: 'School updated successfully',
      token,
      user: {
        id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        school: userDoc.school || ''
      }
    });
  } catch (error) {
    console.error('Error in /api/user/school:', error);
    return res.status(500).json({ message: 'Server error while updating school' });
  }
}; 