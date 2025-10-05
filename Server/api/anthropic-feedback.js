const Anthropic = require('@anthropic-ai/sdk');
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

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    console.error('Anthropic API key is missing for final feedback synthesis');
    return res.status(500).json({
      message: 'Server configuration error: Anthropic API key is missing',
      error: 'API_KEY_MISSING'
    });
  }

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const {
    transcript,
    videoAdvice,
    topic,
    speechType,
    speechContext,
    duration,
    script
  } = req.body || {};

  if (!transcript) {
    return res.status(400).json({
      message: 'Transcript is required for analysis',
      error: 'TRANSCRIPT_MISSING'
    });
  }

  try {
    const minutes = Math.floor((duration || 0) / 60);
    const seconds = (duration || 0) % 60;
    const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const systemPrompt = `You are ARTICULATE, an elite public speaking coach. Combine the exact AssemblyAI transcript with video body-language insights to produce a detailed yet concise evaluation. Return valid JSON only.`;

    const videoAdviceString = videoAdvice ? JSON.stringify(videoAdvice) : 'null';

    const userMessage = `Context:
- Speech type: ${speechType || 'Unknown'}
- Topic: ${topic || 'Unknown'}
- Duration: ${formattedDuration}
${speechContext ? `- Additional notes: ${speechContext}` : ''}
${script ? `- Provided script: "${script}"` : ''}

Exact transcript from AssemblyAI (do not modify or paraphrase in your response, but you may quote short phrases):
"""${transcript}"""

Visual coaching insights from Gemini (JSON):
${videoAdviceString}

Produce a JSON object with keys:
{
  "topic": "one-sentence summary of what the speaker talked about",
  "contentScore": number 0-100,
  "deliveryScore": number 0-100,
  "feedback": "2-3 sentence overall assessment integrating audio and visual insights",
  "strengths": ["at least three strengths"],
  "improvements": ["at least three areas to work on"],
  "ranking": "position 1-7 with brief explanation",
  "actionPlan": ["three short action steps"]
}
Incorporate the provided video advice where relevant. If video advice is null, note that visual feedback is unavailable.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      temperature: 0.4,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    const textContent = response.content
      ?.filter(part => part.type === 'text' && part.text)
      .map(part => part.text)
      .join('\n')
      .trim();

    if (!textContent) {
      throw new Error('Empty response from Anthropic');
    }

    const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/) || textContent.match(/{[\s\S]*?}/);
    if (!jsonMatch) {
      throw new Error('Anthropic response did not include JSON');
    }

    const jsonStr = jsonMatch[0].startsWith('{') ? jsonMatch[0] : jsonMatch[1];
    const parsed = JSON.parse(jsonStr);

    return res.json(parsed);
  } catch (error) {
    console.error('Error generating feedback with Anthropic:', error.response?.data || error.message);

    const status = error.response?.status;
    if (status === 429 || status === 403) {
      return res.status(429).json({
        message: 'Anthropic feedback quota exceeded',
        error: 'ANTHROPIC_QUOTA'
      });
    }

    if (error instanceof SyntaxError) {
      return res.status(500).json({
        message: 'Failed to parse Anthropic response',
        error: 'PARSE_ERROR'
      });
    }

    return res.status(500).json({
      message: `Anthropic feedback failed: ${error.message}`,
      error: 'ANTHROPIC_ERROR'
    });
  }
};
