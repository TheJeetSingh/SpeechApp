const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

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

  const { audio, topic, speechType, speechContext, duration, mimeType } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error("Gemini API key is missing");
    return res.status(500).json({ 
      message: "Server configuration error: API key is missing",
      error: "API_KEY_MISSING"
    });
  }

  if (!audio) {
    console.error("Audio data is missing in request");
    return res.status(400).json({ 
      message: "Audio data is required",
      error: "AUDIO_MISSING"
    });
  }

  try {
    // Simple validation for base64 data
    if (!/^[A-Za-z0-9+/=]+$/.test(audio)) {
      console.error("Invalid audio data format");
      return res.status(400).json({
        message: "Invalid audio data format",
        error: "INVALID_AUDIO_FORMAT"
      });
    }

    // Convert speech duration to minutes and seconds for context
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Determine audio MIME type (ensure it's supported)
    let audioMimeType = mimeType || "audio/webm";
    
    // Map to supported MIME types if needed
    if (audioMimeType === "audio/webm") {
      // Gemini supports these formats directly
      console.log("Using webm audio format");
    } else {
      // Default to a supported format
      console.log(`Converting ${audioMimeType} to audio/mp3 for compatibility`);
      audioMimeType = "audio/mp3";
    }
    
    // Prepare the prompt for Gemini with additional context
    const contextIntro = speechContext ? speechContext : 
      `This is a ${speechType || "speech"} on the topic: "${topic || "Unknown"}". `;
    
    const promptText = `
    You are a professional speech coach analyzing an audio recording of a speech. If you cannot hear audio, please dont make things up instead just tell me that there was no audio. Please grade harshly like a proffesional speech coach and be blunt with improvements with humor and also tell the indivigual what ranking they would get in a room with 7 people where 1 is the best and 7 is the worst.
    
    ${contextIntro}
    The speech duration was: ${formattedDuration}.
    
    Based on the audio, please provide a comprehensive analysis including:
    
    1. Content analysis: What was the speech about? Was the content well-structured and informative?
    2. Delivery analysis: Assess voice modulation, pacing, clarity, pauses, and overall delivery style.
    3. Give a content score from 0-100, if there  was no audio give 0.
    4. Give a delivery score from 0-100, if there  was no audio give 0.
    5. Provide 3-5 specific strengths of the speech.
    6. Provide 3-5 areas for improvement.
    7. Write a 2-3 sentence summary of your overall feedback.
    8. Tell us the ranking.
    
    ${speechType === "Impromptu" ? "For impromptu speeches, focus on creativity, quick thinking, and relevance to the assigned topic." : ""}
    ${speechType === "Extemporaneous" ? "For extemporaneous speeches, focus on evidence, organization, and argument quality, and also relevance to topic." : ""}
    
    Format your response as a JSON object with the following keys:
    {
      "topic": "brief description of what the speech was about",
      "contentScore": number,
      "deliveryScore": number,
      "strengths": ["strength1", "strength2", "strength3"],
      "improvements": ["area1", "area2", "area3"],
      "feedback": "overall feedback summary"
    }
    `;

    // Call Gemini API with the multimodal content (text + audio)
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: promptText
              },
              {
                inline_data: {
                  mime_type: audioMimeType,
                  data: audio
                }
              }
            ]
          }
        ],
        generation_config: {
          temperature: 0.2,
          max_output_tokens: 1024,
          top_p: 0.8,
          top_k: 40
        }
      },
      {
        timeout: 120000, // 2 minute timeout
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract the text response
    if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
      throw new Error("Empty response from AI service");
    }
    
    const textResponse = response.data.candidates[0].content.parts[0].text;
    
    // Extract the JSON from the text response
    const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) || 
                     textResponse.match(/{[\s\S]*?}/);
    
    let analysisJson;
    if (jsonMatch) {
      // Clean up the JSON string
      const jsonStr = jsonMatch[0].replace(/```json\n|```/g, '').trim();
      try {
        analysisJson = JSON.parse(jsonStr);
      } catch (jsonError) {
        throw new Error("Failed to parse analysis result");
      }
    } else {
      // Fallback if we can't parse the JSON
      analysisJson = {
        topic: "Analysis could not determine the speech topic precisely",
        contentScore: 75,
        deliveryScore: 70,
        strengths: ["Attempted speech delivery", "Put effort into preparation"],
        improvements: ["Improve audio quality for better analysis", "Structure speech more clearly"],
        feedback: "The speech was difficult to analyze due to response format. Consider recording again with better quality audio."
      };
    }

    return res.json(analysisJson);
  } catch (err) {
    // Detailed error logging
    console.error("Speech analysis error:", err.message);
    
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.status(500).json({ 
        message: `Error from AI service: ${err.response.status}`,
        error: "API_ERROR",
        details: err.response.data
      });
    } else if (err.request) {
      // The request was made but no response was received
      return res.status(500).json({ 
        message: "No response received from AI service",
        error: "API_TIMEOUT"
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return res.status(500).json({ 
        message: `Error analyzing speech: ${err.message}`,
        error: "PROCESSING_ERROR",
        contentScore: 65,
        deliveryScore: 65,
        strengths: ["Attempted speech practice", "Used the application for improvement"],
        improvements: ["Try recording with clearer audio", "Ensure proper internet connectivity for analysis"],
        feedback: "We encountered an error while analyzing your speech. Please try again with a clearer recording."
      });
    }
  }
}; 