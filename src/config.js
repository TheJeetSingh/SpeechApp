const isDevelopment = process.env.NODE_ENV === 'development';

// Function to determine API URL
const getApiUrl = () => {
  // In development, use empty string to leverage the proxy
  if (isDevelopment) {
    console.log('Development environment detected, using proxy');
    // Use the proxy specified in package.json
    return ''; // Empty string uses the proxy
  }
  
  // In production, use the provided API URL or fallback to the default
  console.log('Production environment detected, using full API URL');
  return process.env.REACT_APP_API_URL || 'https://speech-app-server.vercel.app';
};

// For debugging connectivity
const API_URL = getApiUrl();
console.log(`Config: API_URL = "${API_URL}"`);
if (isDevelopment) {
  console.log('In development, API requests will be proxied to: http://localhost:5001');
}

const config = {
  // API URL will be empty in development (to use proxy) and absolute URL in production
  API_URL,
  NEWS_ENDPOINT: '/api/news',
  NYT_NEWS_ENDPOINT: '/api/nyt-news',
  CORS_TEST_ENDPOINT: '/api/cors-test',
  NEWS_API_KEY: process.env.REACT_APP_NEWS_API_KEY,
  NYT_API_KEY: process.env.REACT_APP_NYT_API_KEY,
  DEFAULT_NEWS_PARAMS: {
    country: 'us',
    pageSize: 10,
    apiKey: process.env.REACT_APP_NEWS_API_KEY
  }
};

export default config;
