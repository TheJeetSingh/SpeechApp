const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected in password update function");
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
  console.log('Generating token in password update function:', {
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

// Handler for the /api/user/password endpoint
module.exports = async (req, res) => {
  // Set CORS headers for all responses - using exact same format as login.js
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log('Password OPTIONS request received');
    return res.status(200).end();
  }
  
  // Only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  console.log('Password update request received');
  
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Authenticate the user
    let user;
    try {
      user = auth(req);
      console.log('User authenticated for password change:', user);
    } catch (error) {
      console.error('Authentication error:', error.message);
      return res.status(401).json({ message: error.message });
    }
    
    // Extract password data from request body
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Find the user
    const userDoc = await User.findById(user.id);
    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, userDoc.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    userDoc.password = hashedPassword;
    await userDoc.save();
    console.log('Password updated successfully for user:', user.id);
    
    // Generate a new token
    const token = generateToken(userDoc);
    
    // Return success response
    return res.status(200).json({
      message: 'Password updated successfully',
      token,
      user: {
        id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        school: userDoc.school || ''
      }
    });
  } catch (error) {
    console.error('Error in /api/user/password:', error);
    return res.status(500).json({ message: 'Server error while updating password' });
  }
};