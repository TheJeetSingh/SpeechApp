const isDevelopment = process.env.NODE_ENV === 'development';

// Function to determine API URL
const getApiUrl = () => {
  // Always use the full server URL for consistent behavior across environments
  return process.env.REACT_APP_API_URL || 'https://speech-app-server.vercel.app';
};

const config = {
  // API URL will always be the complete URL to avoid CORS issues
  API_URL: getApiUrl(),
  NEWS_ENDPOINT: '/api/news',
  NEWS_API_KEY: process.env.REACT_APP_NEWS_API_KEY,
  DEFAULT_NEWS_PARAMS: {
    country: 'us',
    pageSize: 10,
    apiKey: process.env.REACT_APP_NEWS_API_KEY
  }
};

export default config;
