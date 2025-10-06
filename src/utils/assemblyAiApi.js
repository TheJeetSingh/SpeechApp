import { buildApiUrl } from './apiConfig';

/**
 * AssemblyAI API utility functions for speech analysis
 * This client-side code calls our server endpoint which handles the AssemblyAI API
 */

// Get the API key from environment variables
const API_KEY = process.env.REACT_APP_ASSEMBLYAI_API_KEY;
if (!API_KEY) {
  console.error("Warning: REACT_APP_ASSEMBLYAI_API_KEY environment variable is not set");
  console.log("Available env variables:", Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
}

/**
 * Upload audio to AssemblyAI for processing
 * @param {Blob} audioBlob - The audio blob to upload
 * @returns {Promise<string>} - The upload URL
 */
export const uploadAudio = async (audioBlob) => {
  // Double-check for API key at runtime
  const apiKey = process.env.REACT_APP_ASSEMBLYAI_API_KEY;
  
  if (!apiKey) {
    console.error("No AssemblyAI API key found. Available env vars:", 
      Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
    throw new Error("No AssemblyAI API key provided. Please set the REACT_APP_ASSEMBLYAI_API_KEY environment variable.");
  }

  try {
    const response = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'Authorization': apiKey
      },
      body: audioBlob
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.upload_url;
  } catch (error) {
    console.error("Error uploading audio to AssemblyAI:", error);
    throw error;
  }
};

/**
 * Transcribe audio using AssemblyAI
 * @param {string} audioUrl - The URL of the uploaded audio
 * @returns {Promise<string>} - The transcript ID
 */
export const transcribeAudio = async (audioUrl) => {
  const apiKey = process.env.REACT_APP_ASSEMBLYAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("No AssemblyAI API key provided. Please set the REACT_APP_ASSEMBLYAI_API_KEY environment variable.");
  }

  try {
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        language_code: 'en_us',
        punctuate: true,
        format_text: true
      })
    });

    if (!response.ok) {
      throw new Error(`Transcription request failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Error requesting transcription from AssemblyAI:", error);
    throw error;
  }
};

/**
 * Check transcription status and get results
 * @param {string} transcriptId - The ID of the transcript
 * @returns {Promise<object>} - The transcript data
 */
export const getTranscriptionResult = async (transcriptId) => {
  const apiKey = process.env.REACT_APP_ASSEMBLYAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("No AssemblyAI API key provided. Please set the REACT_APP_ASSEMBLYAI_API_KEY environment variable.");
  }

  try {
    const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      method: 'GET',
      headers: {
        'Authorization': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get transcription with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting transcription result from AssemblyAI:", error);
    throw error;
  }
};

/**
 * Wait for transcription to complete and return the result
 * @param {string} transcriptId - The ID of the transcript
 * @returns {Promise<object>} - The completed transcript data
 */
export const waitForTranscriptionCompletion = async (transcriptId) => {
  const maxAttempts = 60; // Maximum number of polling attempts
  const pollingInterval = 2000; // Polling interval in milliseconds (2 seconds)
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await getTranscriptionResult(transcriptId);
    
    if (result.status === 'completed') {
      return result;
    } else if (result.status === 'error') {
      throw new Error(`Transcription failed: ${result.error}`);
    }
    
    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, pollingInterval));
  }
  
  throw new Error('Transcription timed out');
};

/**
 * Process audio with AssemblyAI via our server endpoint
 * @param {Blob} audioBlob - The audio blob to process
 * @returns {Promise<string>} - The transcript text
 */
const TRANSCRIBE_AUDIO_ENDPOINT = buildApiUrl('/api/transcribe-audio');

const sanitizeBase64 = (value) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/\s+/g, '');
};

export const processAudioWithAssemblyAI = async (audioBlob) => {
  try {
    console.log("Processing audio with AssemblyAI via server endpoint");
    
    // Convert blob to base64
    const base64Audio = await blobToBase64(audioBlob);
    const sanitizedAudio = sanitizeBase64(base64Audio);

    if (!sanitizedAudio) {
      throw new Error('Failed to encode audio data');
    }
    
    // Call our server endpoint
    const apiUrl = TRANSCRIBE_AUDIO_ENDPOINT;

    console.log(`Sending request to transcribe audio API: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio: sanitizedAudio
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API response error:", errorText);
      throw new Error(`Failed to transcribe audio: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.transcript;
  } catch (error) {
    console.error("Error processing audio with AssemblyAI:", error);
    throw error;
  }
};

/**
 * Convert a Blob to a base64 string
 * @param {Blob} blob - The blob to convert
 * @returns {Promise<string>} - The base64 string
 */
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}; 