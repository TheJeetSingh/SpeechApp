/**
 * Agora Token Generation Utility
 * 
 * This file provides functions to generate tokens for Agora WebRTC.
 * In a production environment, token generation should happen on the server side.
 */

// Simple random ID generator for demo purposes
export const generateUid = () => {
  return Math.floor(Math.random() * 1000000);
};

// Get the Agora App ID from environment variables
export const getAgoraAppId = () => {
  const appId = process.env.REACT_APP_AGORA_APP_ID;
  
  // Validate the App ID format (should be 32 characters for Agora App IDs)
  if (appId && appId.length !== 32) {
    console.warn(`Agora App ID has unexpected length: ${appId.length} (should be 32)`);
  }
  
  console.log('REACT_APP_AGORA_APP_ID:', appId ? `${appId.substring(0, 4)}...` : 'Not Set');
  return appId;
};

// Get a token from the server for secure Agora communication
export const getAgoraToken = async (channelName, uid) => {
  try {
    // ALWAYS use localhost in development mode
    let baseUrl = 'http://localhost:5001';
    
    // Only use environment variable in production
    if (process.env.NODE_ENV === 'production') {
      baseUrl = process.env.REACT_APP_API_BASE_URL || baseUrl;
    } else {
      console.log('Development mode: Forcing localhost API URL');
    }
    
    console.log('REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
    console.log('Using base URL:', baseUrl);
    
    const apiUrl = `${baseUrl.replace(/\/+$/, '')}/api/agora/token`;
    
    console.log('Requesting token from:', apiUrl);
    
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          channelName, 
          uid, 
          role: 'publisher',
          expirationTimeInSeconds: 3600 // 1 hour
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Error getting Agora token:', errorData);
        
        // For development, allow direct connection without token
        if (process.env.NODE_ENV === 'development') {
          console.warn('Using direct connection without token in development mode');
          return null;
        }
        return null;
      }
      
      const data = await response.json();
      
      if (!data.token) {
        console.error('Token not found in response:', data);
        return null;
      }
      
      // Verify token format (should start with "006" for Agora tokens)
      if (!data.token.startsWith('006')) {
        console.error('Invalid token format:', data.token.substring(0, 10) + '...');
        return null;
      }
      
      console.log('Successfully obtained token:', data.token.substring(0, 10) + '...');
      return data.token;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Check if this is a CORS error
      if (fetchError.message && (
          fetchError.message.includes('NetworkError') || 
          fetchError.message.includes('Failed to fetch') ||
          fetchError.message.includes('Network request failed')
        )) {
        console.error('CORS or network error detected:', fetchError);
        console.warn('Falling back to direct connection due to CORS/network error');
        
        // For development, allow direct connection without token
        if (process.env.NODE_ENV === 'development') {
          console.warn('Using direct connection without token in development mode');
          return null;
        }
      }
      
      throw fetchError; // Re-throw for the outer catch block
    }
  } catch (error) {
    console.error('Failed to fetch Agora token:', error);
    
    // For development, allow direct connection without token
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using direct connection without token in development mode');
      return null;
    }
    return null;
  }
};

// Create a channel name with a timestamp to ensure uniqueness
export const generateChannelName = (prefix = 'speech-tutoring') => {
  const timestamp = new Date().getTime();
  return `${prefix}-${timestamp}`;
};

// Check if Agora credentials are configured
export const isAgoraConfigured = () => {
  const appId = process.env.REACT_APP_AGORA_APP_ID;
  
  // Log the status for debugging
  if (!appId) {
    console.error('Agora App ID is not set in environment variables');
    return false;
  }
  
  if (appId === 'your_agora_app_id_here') {
    console.error('Agora App ID is still using the placeholder value');
    return false;
  }
  
  console.log('Agora is properly configured with App ID:', appId.substring(0, 4) + '...');
  return true;
};

// Check if we should use token authentication
// This is a workaround for the "dynamic use static key" error
export const shouldUseTokenAuth = async () => {
  // In development, we can try both methods
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: will try both authentication methods');
    
    // Check if we have previously determined the auth mode
    const storedAuthMode = localStorage.getItem('agoraAuthMode');
    if (storedAuthMode) {
      const useToken = storedAuthMode === 'token';
      console.log(`Using previously determined auth mode: ${useToken ? 'token' : 'direct'}`);
      return useToken;
    }
    
    // Default to token auth first
    return true;
  }
  
  // In production, always use token authentication for security
  return true;
};

// Store the successful authentication mode for future use
export const setAuthenticationMode = (useToken) => {
  try {
    localStorage.setItem('agoraAuthMode', useToken ? 'token' : 'direct');
    console.log(`Saved authentication mode: ${useToken ? 'token' : 'direct'}`);
  } catch (e) {
    console.error('Failed to save authentication mode:', e);
  }
}; 