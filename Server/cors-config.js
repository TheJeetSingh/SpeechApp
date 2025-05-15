/**
 * CORS Configuration for Speech App Server
 * Handles cross-origin resource sharing for the application
 */

const cors = require('cors');

// Specific origins to allow
const allowedOrigins = [
  'http://localhost:3000',
  'https://speech-app-delta.vercel.app',
  'https://speech-app-server.vercel.app'
];

// Parse environment variable for allowed origins if available
if (process.env.CORS_ALLOWED_ORIGINS) {
  const envOrigins = process.env.CORS_ALLOWED_ORIGINS.split(',');
  envOrigins.forEach(origin => {
    if (!allowedOrigins.includes(origin)) {
      allowedOrigins.push(origin);
    }
  });
}

console.log('CORS: Allowed origins:', allowedOrigins);

// Configure CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      // In production, we'll allow the frontend domain as fallback
      callback(null, 'https://speech-app-delta.vercel.app');
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Export the configured CORS middleware
module.exports = cors(corsOptions); 