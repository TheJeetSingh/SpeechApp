const axios = require('axios');
require('dotenv').config();

const setCorsHeaders = (req, res) => {
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
  const setOrigin = (origin, allowCredentials = true) => {
    if (!origin) {
      return;
    }

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', allowCredentials ? 'true' : 'false');
  };

  if (requestOrigin) {
    if (allowedOrigins.includes(requestOrigin)) {
      setOrigin(requestOrigin);
      res.setHeader('Vary', 'Origin');
    } else {
      return false;
    }
  } else {
    const fallbackOrigin = allowedOrigins[0] || '*';
    const allowCredentials = fallbackOrigin !== '*';
    setOrigin(fallbackOrigin, allowCredentials);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  return true;
};

module.exports = async (req, res) => {
  const corsOk = setCorsHeaders(req, res);
  if (corsOk === false) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key is missing for video analysis');
    return res.status(500).json({
      message: 'Server configuration error: Gemini API key is missing',
      error: 'API_KEY_MISSING'
    });
  }

  const { video, mimeType, topic, speechType, duration } = req.body || {};

  if (!video) {
    return res.status(400).json({
      message: 'Video data is required for analysis',
      error: 'VIDEO_MISSING'
    });
  }

  try {
    if (!/^[A-Za-z0-9+/=]+$/.test(video)) {
      return res.status(400).json({
        message: 'Invalid video data format',
        error: 'INVALID_VIDEO_FORMAT'
      });
    }

    const minutes = Math.floor((duration || 0) / 60);
    const seconds = (duration || 0) % 60;
    const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const contextDetails = [
      speechType ? `Speech type: ${speechType}.` : null,
      topic ? `Topic: "${topic}".` : null,
      duration ? `Recording duration: ${formattedDuration}.` : null
    ].filter(Boolean).join(' ');

    const promptText = `You are an elite public speaking coach who evaluates only the visual aspects of a speech.
${contextDetails}
Analyze the attached silent video recording and focus exclusively on non-verbal delivery: posture, gestures, eye contact, facial expression, stage movement, and overall physical presence.
Return a JSON object with the following structure:
{
  "summary": "2-3 sentence overview of the speaker's body language",
  "visualStrengths": ["three concise strengths"],
  "visualImprovements": ["three concise improvement suggestions"],
  "confidence": number between 1 and 5 indicating your confidence in this visual assessment
}
Keep your assessment grounded in what you observe visually and avoid commenting on vocal delivery or content.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: promptText },
              {
                inline_data: {
                  mime_type: mimeType || 'video/mp4',
                  data: video
                }
              }
            ]
          }
        ],
        generation_config: {
          temperature: 0.4,
          max_output_tokens: 768,
          top_p: 0.8,
          top_k: 32
        }
      },
      {
        timeout: 120000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const candidate = response.data?.candidates?.[0];
    if (!candidate) {
      throw new Error('Empty response from Gemini video analysis');
    }

    const combinedText = candidate.content?.parts
      ?.map(part => part.text)
      .filter(Boolean)
      .join('\n')
      .trim();

    if (!combinedText) {
      throw new Error('No textual advice returned from Gemini video analysis');
    }

    const jsonMatch = combinedText.match(/```json\n([\s\S]*?)\n```/) || combinedText.match(/{[\s\S]*?}/);
    let parsed;

    if (jsonMatch) {
      const jsonStr = jsonMatch[0].startsWith('{') ? jsonMatch[0] : jsonMatch[1];
      parsed = JSON.parse(jsonStr);
    } else {
      parsed = {
        summary: combinedText,
        visualStrengths: [],
        visualImprovements: [],
        confidence: 3
      };
    }

    return res.json({ advice: parsed });
  } catch (error) {
    console.error('Error analyzing video with Gemini:', error.response?.data || error.message);

    const status = error.response?.status;
    if (status === 429 || status === 403) {
      return res.status(429).json({
        message: 'Gemini video analysis quota exceeded',
        error: 'GEMINI_QUOTA'
      });
    }

    if (error instanceof SyntaxError) {
      return res.status(500).json({
        message: 'Failed to parse Gemini video analysis response',
        error: 'PARSE_ERROR'
      });
    }

    return res.status(500).json({
      message: `Video analysis failed: ${error.message}`,
      error: 'VIDEO_ANALYSIS_ERROR'
    });
  }
};
