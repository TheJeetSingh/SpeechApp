const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  // Use relative URL in development to leverage proxy, absolute URL in production
  API_URL: isDevelopment ? '' : (process.env.REACT_APP_API_URL || 'https://speech-app-server.vercel.app'),
  NEWS_ENDPOINT: '/api/news',
  NEWS_API_KEY: process.env.REACT_APP_NEWS_API_KEY,
  DEFAULT_NEWS_PARAMS: {
    country: 'us',
    pageSize: 10,
    apiKey: process.env.REACT_APP_NEWS_API_KEY
  }
};

export default config;
