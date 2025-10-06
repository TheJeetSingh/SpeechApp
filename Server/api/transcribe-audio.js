const axios = require('axios');
require('dotenv').config();

/**
 * AssemblyAI API utility functions for speech analysis
 */

// Get the API key from environment variables
const API_KEY = process.env.ASSEMBLYAI_API_KEY;

/**
 * Upload audio to AssemblyAI for processing
 * @param {Buffer} audioBuffer - The audio buffer to upload
 * @returns {Promise<string>} - The upload URL
 */
const uploadAudio = async (audioBuffer) => {
  if (!API_KEY) {
    throw new Error("No AssemblyAI API key provided. Please set the ASSEMBLYAI_API_KEY environment variable.");
  }

  try {
    const response = await axios.post('https://api.assemblyai.com/v2/upload', 
      audioBuffer,
      {
        headers: {
          'Authorization': API_KEY,
          'Content-Type': 'application/octet-stream'
        }
      }
    );

    return response.data.upload_url;
  } catch (error) {
    console.error("Error uploading audio to AssemblyAI:", error.response?.data || error.message);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Transcribe audio using AssemblyAI
 * @param {string} audioUrl - The URL of the uploaded audio
 * @returns {Promise<string>} - The transcript ID
 */
const transcribeAudio = async (audioUrl) => {
  if (!API_KEY) {
    throw new Error("No AssemblyAI API key provided. Please set the ASSEMBLYAI_API_KEY environment variable.");
  }

  try {
    const response = await axios.post('https://api.assemblyai.com/v2/transcript', 
      {
        audio_url: audioUrl,
        language_code: 'en_us',
        punctuate: true,
        format_text: true
      },
      {
        headers: {
          'Authorization': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.id;
  } catch (error) {
    console.error("Error requesting transcription from AssemblyAI:", error.response?.data || error.message);
    throw new Error(`Transcription request failed: ${error.message}`);
  }
};

/**
 * Check transcription status and get results
 * @param {string} transcriptId - The ID of the transcript
 * @returns {Promise<object>} - The transcript data
 */
const getTranscriptionResult = async (transcriptId) => {
  if (!API_KEY) {
    throw new Error("No AssemblyAI API key provided. Please set the ASSEMBLYAI_API_KEY environment variable.");
  }

  try {
    const response = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: {
        'Authorization': API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error getting transcription result from AssemblyAI:", error.response?.data || error.message);
    throw new Error(`Failed to get transcription: ${error.message}`);
  }
};

/**
 * Wait for transcription to complete and return the result
 * @param {string} transcriptId - The ID of the transcript
 * @returns {Promise<object>} - The completed transcript data
 */
const waitForTranscriptionCompletion = async (transcriptId) => {
  const maxAttempts = 30; // Maximum number of polling attempts
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
 * Process audio with AssemblyAI and return the transcript
 * @param {Buffer} audioBuffer - The audio buffer to process
 * @returns {Promise<string>} - The transcript text
 */
const processAudioWithAssemblyAI = async (audioBuffer) => {
  try {
    // Upload the audio file to AssemblyAI
    const uploadUrl = await uploadAudio(audioBuffer);
    
    // Request transcription
    const transcriptId = await transcribeAudio(uploadUrl);
    
    // Wait for transcription to complete
    const transcriptionResult = await waitForTranscriptionCompletion(transcriptId);
    
    // Return the transcript text
    return transcriptionResult.text;
  } catch (error) {
    console.error("Error processing audio with AssemblyAI:", error);
    throw error;
  }
};

// Create a serverless-friendly handler
module.exports = async (req, res) => {
  // Enable CORS
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:5001',
        'https://speech-app-delta.vercel.app',
        'https://speech-app-server.vercel.app',
        'https://www.articulate.ninja'
      ];

  const requestOrigin = req.headers.origin;
  const setCorsOrigin = (origin, allowCredentials = true) => {
    if (!origin) {
      return;
    }

    res.setHeader('Access-Control-Allow-Origin', origin);

    if (allowCredentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
      res.setHeader('Access-Control-Allow-Credentials', 'false');
    }
  };

  if (requestOrigin) {
    if (allowedOrigins.includes(requestOrigin)) {
      setCorsOrigin(requestOrigin);
      res.setHeader('Vary', 'Origin');
    } else {
      return res.status(403).json({ error: 'Origin not allowed' });
    }
  } else {
    const fallbackOrigin = allowedOrigins[0] || '*';
    const allowCredentials = fallbackOrigin !== '*';
    setCorsOrigin(fallbackOrigin, allowCredentials);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check if request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { audio } = req.body;

    if (!audio || typeof audio !== 'string') {
      return res.status(400).json({
        message: "Audio data is required",
        error: "AUDIO_MISSING"
      });
    }

    const sanitizedAudio = audio.replace(/\s+/g, '');

    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(sanitizedAudio)) {
      return res.status(400).json({
        message: 'Invalid audio data format',
        error: 'INVALID_AUDIO_DATA'
      });
    }

    let audioBuffer;

    try {
      audioBuffer = Buffer.from(sanitizedAudio, 'base64');
    } catch (bufferError) {
      console.error('Failed to decode audio base64:', bufferError);
      return res.status(400).json({
        message: 'Unable to decode audio data',
        error: 'INVALID_AUDIO_DATA'
      });
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(400).json({
        message: 'Audio data could not be decoded',
        error: 'INVALID_AUDIO_DATA'
      });
    }

    const reconverted = audioBuffer.toString('base64');
    const normalizedInput = sanitizedAudio.replace(/=+$/, '');
    const normalizedOutput = reconverted.replace(/=+$/, '');

    if (normalizedInput !== normalizedOutput) {
      return res.status(400).json({
        message: 'Audio data failed validation',
        error: 'INVALID_AUDIO_DATA'
      });
    }

    // Process the audio with AssemblyAI
    const transcript = await processAudioWithAssemblyAI(audioBuffer);
    
    // Return the transcript
    return res.status(200).json({ transcript });
  } catch (error) {
    console.error("Error in transcribe-audio endpoint:", error);
    return res.status(500).json({ 
      message: `Transcription failed: ${error.message}`,
      error: "TRANSCRIPTION_ERROR"
    });
  }
}; 