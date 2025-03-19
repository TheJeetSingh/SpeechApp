const isDevelopment = process.env.NODE_ENV === 'development';

// Function to determine API URL
const getApiUrl = () => {
  // In development, use empty string to leverage the proxy
  if (isDevelopment) {
    console.log('Development environment detected, using proxy');
    return '';
  }
  
  // In production, use the provided API URL or fallback to the default
  console.log('Production environment detected, using full API URL');
  return process.env.REACT_APP_API_URL || 'https://speech-app-server.vercel.app';
};

const config = {
  // API URL will be empty in development (to use proxy) and absolute URL in production
  API_URL: getApiUrl(),
  NEWS_ENDPOINT: '/api/news',
  CORS_TEST_ENDPOINT: '/api/cors-test',
  NEWS_API_KEY: process.env.REACT_APP_NEWS_API_KEY,
  DEFAULT_NEWS_PARAMS: {
    country: 'us',
    pageSize: 10,
    apiKey: process.env.REACT_APP_NEWS_API_KEY
  }
};

export default config;
