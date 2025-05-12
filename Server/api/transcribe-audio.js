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
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
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
    
    if (!audio) {
      return res.status(400).json({ 
        message: "Audio data is required",
        error: "AUDIO_MISSING"
      });
    }
    
    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio, 'base64');
    
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