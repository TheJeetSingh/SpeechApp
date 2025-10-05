import { processAudioWithAssemblyAI } from './assemblyAiApi';
import { generateChatResponse } from './geminiApi';

const API_BASE = '/api';

/**
 * Analyze speech using AssemblyAI for transcription and Gemini for coaching
 * @param {Blob} audioBlob - The audio blob to analyze
 * @param {string} topic - The topic of the speech
 * @param {string} speechType - The type of speech (e.g., Impromptu, Extemporaneous)
 * @param {string} speechContext - Additional context about the speech
 * @param {number} duration - The duration of the speech in seconds
 * @param {string} script - Optional script content for comparison
 * @returns {Promise<object>} - The speech analysis results
 */
export const analyzeSpeech = async (audioBlob, topic, speechType, speechContext, duration, script = null, videoBlob = null) => {
  try {
    console.log("Starting speech analysis with AssemblyAI and Gemini");
    
    // Step 1: Get transcript from AssemblyAI
    console.log("Getting transcript from AssemblyAI...");
    let transcript;
    try {
      transcript = await processAudioWithAssemblyAI(audioBlob);
    } catch (error) {
      console.error("Error getting transcript from AssemblyAI:", error);
      // Check if it's a server error (500)
      if (error.message && error.message.includes('500')) {
        throw new Error("Server error: Failed to transcribe audio. Please try again later.");
      }
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
    
    if (!transcript || transcript.trim() === "") {
      console.error("No transcript detected from AssemblyAI");
      return {
        contentScore: 15,
        deliveryScore: 10,
        feedback: "We couldn't detect any speech in your recording. Please ensure you're speaking clearly and try again.",
        topic: "No speech detected",
        strengths: ["Attempting to use the speech analysis tool", "Showing interest in improving your speaking skills"],
        improvements: ["Ensure you're actually speaking during recording", "Speak clearly and directly into the microphone", "Reduce background noise when recording"],
        poorQuality: true,
        transcript: transcript || "",
        videoAdvice: null
      };
    }
    
    console.log("Transcript received:", transcript.substring(0, 100) + "...");

    // Step 2: Analyze the recorded video with Gemini for visual feedback
    let videoAdvice = null;
    if (videoBlob) {
      try {
        videoAdvice = await analyzeVideoWithGemini(videoBlob, {
          topic,
          speechType,
          duration
        });
        console.log("Received video advice from Gemini");
      } catch (error) {
        console.error("Video analysis unavailable:", error);
        videoAdvice = buildVideoAdviceFallback(error);
      }
    }

    // Step 3: Combine transcript + visual advice using Anthropic (cheap model)
    let analysis;
    try {
      analysis = await synthesizeFeedbackWithAnthropic({
        transcript,
        videoAdvice,
        topic,
        speechType,
        speechContext,
        duration,
        script
      });
      console.log("Received combined feedback from Anthropic");
    } catch (anthropicError) {
      console.error("Anthropic synthesis failed, falling back to Gemini:", anthropicError);
      analysis = await synthesizeFeedbackWithGeminiFallback({
        transcript,
        videoAdvice,
        topic,
        speechType,
        speechContext,
        duration,
        script
      });
    }

    return {
      ...analysis,
      transcript,
      videoAdvice
    };
  } catch (error) {
    console.error("Error in speech analysis:", error);
    throw error;
  }
};

const analyzeVideoWithGemini = async (videoBlob, { topic, speechType, duration }) => {
  const preferredType = (videoBlob && typeof videoBlob === 'object')
    ? (videoBlob.type || videoBlob.mimeType)
    : undefined;
  const normalizedBlob = await normalizeToBlob(videoBlob, preferredType || 'video/mp4');

  const base64Video = await blobToBase64(normalizedBlob);

  const response = await fetch(`${API_BASE}/analyze-video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      video: base64Video,
      mimeType: normalizedBlob.type || 'video/mp4',
      topic,
      speechType,
      duration
    })
  });

  if (!response.ok) {
    const error = new Error(`Gemini video analysis failed with status ${response.status}`);
    error.status = response.status;
    error.details = await safeReadText(response);
    throw error;
  }

  const data = await response.json();
  return data.advice;
};

const buildVideoAdviceFallback = (error) => {
  const message = error?.status === 429
    ? 'Video analysis service hit a rate limit. Please try again shortly.'
    : 'Video analysis is temporarily unavailable. Re-run the analysis when service is restored.';

  return {
    summary: message,
    visualStrengths: [],
    visualImprovements: ['Retry the analysis later when video coaching is available.'],
    confidence: 0,
    unavailable: true,
    error: error?.details || error?.message || 'Unknown error'
  };
};

const synthesizeFeedbackWithAnthropic = async (payload) => {
  const response = await fetch(`${API_BASE}/anthropic-feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = new Error(`Anthropic feedback failed with status ${response.status}`);
    error.status = response.status;
    error.details = await safeReadText(response);
    throw error;
  }

  const data = await response.json();
  return normalizeAnalysisResult(data);
};

const synthesizeFeedbackWithGeminiFallback = async ({
  transcript,
  videoAdvice,
  topic,
  speechType,
  speechContext,
  duration,
  script
}) => {
  const formattedDuration = `${Math.floor((duration || 0) / 60)}:${((duration || 0) % 60).toString().padStart(2, '0')}`;

  const prompt = `You are ARTICULATE, an expert AI speech coach. The AssemblyAI transcript and visual insights are provided below.

Speech type: ${speechType || 'Unknown'}
Topic: ${topic || 'Unknown'}
Duration: ${formattedDuration}
${speechContext || ''}
${script ? `Prepared script: "${script}"` : ''}

Transcript (do not alter, but you may quote phrases):
"""${transcript}"""

Visual advice (may be unavailable):
${JSON.stringify(videoAdvice ?? { summary: 'No video advice available.' }, null, 2)}

Provide a JSON object with the following keys:
{
  "topic": "one sentence summary of what the speaker covered",
  "contentScore": number between 0 and 100,
  "deliveryScore": number between 0 and 100,
  "feedback": "2-3 sentence summary that blends audio and visual observations",
  "strengths": ["at least three bullet strengths"],
  "improvements": ["at least three targeted improvements"],
  "ranking": "placement from 1-7 with rationale",
  "actionPlan": ["three concise next steps"]
}`;

  const responseText = await generateChatResponse([{ sender: 'user', text: prompt }]);
  const parsed = parseJsonFromText(responseText);

  if (parsed) {
    return normalizeAnalysisResult(parsed);
  }

  // Fall back to heuristic extraction if structured JSON is missing
  const extracted = extractAnalysisData(responseText);
  return normalizeAnalysisResult(extracted);
};

const parseJsonFromText = (text) => {
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*?}/);
  if (!jsonMatch) {
    return null;
  }

  const jsonStr = jsonMatch[0].startsWith('{') ? jsonMatch[0] : jsonMatch[1];

  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Failed to parse JSON block:', error);
    return null;
  }
};

const normalizeAnalysisResult = (analysisJson = {}) => {
  const strengths = Array.isArray(analysisJson.strengths) && analysisJson.strengths.length > 0
    ? analysisJson.strengths
    : ['Speech was analyzed successfully'];

  const improvements = Array.isArray(analysisJson.improvements) && analysisJson.improvements.length > 0
    ? analysisJson.improvements
    : ['Consider practicing more'];

  const actionPlan = Array.isArray(analysisJson.actionPlan)
    ? analysisJson.actionPlan.filter(Boolean)
    : [];

  return {
    ...analysisJson,
    contentScore: clampScore(analysisJson.contentScore, 50),
    deliveryScore: clampScore(analysisJson.deliveryScore, 50),
    feedback: analysisJson.feedback || 'Speech analysis completed.',
    topic: analysisJson.topic || 'Topic analysis not available.',
    strengths,
    improvements,
    actionPlan,
    ranking: analysisJson.ranking || analysisJson.rank || '',
    poorQuality: Boolean(analysisJson.poorQuality)
  };
};

const clampScore = (value, defaultValue = 50) => {
  const num = Number(value);
  if (Number.isFinite(num)) {
    return Math.min(100, Math.max(0, Math.round(num)));
  }
  return defaultValue;
};

const blobToBase64 = (blob) => new Promise((resolve, reject) => {
  if (typeof Blob === 'undefined' || !(blob instanceof Blob)) {
    reject(new Error('Video data must be provided as a Blob.'));
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64String = reader.result.split(',')[1];
    resolve(base64String);
  };
  reader.onerror = () => reject(new Error('Failed to read blob as base64'));
  reader.readAsDataURL(blob);
});

const normalizeToBlob = async (value, fallbackType = 'video/mp4') => {
  if (typeof Blob === 'undefined') {
    throw new Error('Current environment does not support Blob conversions');
  }

  if (value instanceof Blob) {
    return value;
  }

  const targetType = (value && (value.type || value.mimeType)) || fallbackType;

  if (value instanceof ArrayBuffer) {
    return new Blob([value], { type: targetType });
  }

  if (ArrayBuffer.isView(value)) {
    const view = value;
    const buffer = view.byteOffset === 0 && view.byteLength === view.buffer.byteLength
      ? view.buffer
      : view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
    return new Blob([buffer], { type: targetType });
  }

  if (value && typeof value === 'object') {
    if (typeof value.arrayBuffer === 'function') {
      const buffer = await value.arrayBuffer();
      return new Blob([buffer], { type: targetType });
    }

    if (typeof value.base64 === 'string') {
      const bytes = decodeBase64ToUint8Array(value.base64);
      return new Blob([bytes], { type: targetType });
    }
  }

  throw new Error('Invalid video blob provided for analysis');
};

const decodeBase64ToUint8Array = (input) => {
  const cleaned = (input || '').replace(/\s+/g, '');
  if (!cleaned) {
    throw new Error('Empty base64 payload cannot be converted to bytes');
  }

  if (typeof atob === 'function') {
    const binary = atob(cleaned);
    const length = binary.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  if (typeof Buffer !== 'undefined') {
    const buffer = Buffer.from(cleaned, 'base64');
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  throw new Error('No base64 decoding implementation available');
};

const safeReadText = async (response) => {
  try {
    return await response.text();
  } catch (error) {
    console.error('Failed to read response text:', error);
    return '';
  }
};

/**
 * Extract analysis data from text using regex when JSON parsing fails
 * @param {string} text - The analysis text from Gemini
 * @returns {object} - Extracted analysis data
 */
function extractAnalysisData(text) {
  const contentScore = extractNumber(text, /content\s*score:?\s*(\d+)/i) || 
                      extractNumber(text, /content:?\s*(\d+)/i) || 50;
                      
  const deliveryScore = extractNumber(text, /delivery\s*score:?\s*(\d+)/i) || 
                       extractNumber(text, /delivery:?\s*(\d+)/i) || 50;
  
  // Extract feedback - look for a paragraph after "feedback" or "summary"
  const feedbackMatch = text.match(/feedback:?\s*([^\n]+(?:\n[^\n]+)*)/i) || 
                       text.match(/summary:?\s*([^\n]+(?:\n[^\n]+)*)/i) || 
                       text.match(/overall:?\s*([^\n]+(?:\n[^\n]+)*)/i);
  const feedback = feedbackMatch ? feedbackMatch[1].trim() : "Speech analysis completed.";
  
  // Extract topic analysis
  const topicMatch = text.match(/topic:?\s*([^\n]+(?:\n[^\n]+)*)/i) || 
                    text.match(/content:?\s*([^\n]+(?:\n[^\n]+)*)/i);
  const topic = topicMatch ? topicMatch[1].trim() : "Topic analysis not available.";
  
  // Extract strengths - look for bullets or numbered items after "strengths"
  const strengthsSection = text.match(/strengths:?\s*([\s\S]*?)(?=improvements|weaknesses|areas|$)/i);
  const strengths = strengthsSection 
    ? extractListItems(strengthsSection[1])
    : ["Speech was analyzed successfully"];
  
  // Extract improvements - look for bullets or numbered items after "improvements" or "weaknesses"
  const improvementsSection = text.match(/(?:improvements|weaknesses|areas for improvement):?\s*([\s\S]*?)(?=strengths|conclusion|$)/i);
  const improvements = improvementsSection 
    ? extractListItems(improvementsSection[1])
    : ["Consider practicing more"];
  
  return {
    contentScore,
    deliveryScore,
    feedback,
    topic,
    strengths,
    improvements
  };
}

/**
 * Extract a number from text using regex
 * @param {string} text - The text to search in
 * @param {RegExp} regex - The regex pattern with a capturing group for the number
 * @returns {number|null} - The extracted number or null if not found
 */
function extractNumber(text, regex) {
  const match = text.match(regex);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Extract list items from text (bullets or numbered)
 * @param {string} text - The text containing list items
 * @returns {string[]} - Array of list items
 */
function extractListItems(text) {
  // Match items that start with bullet points, numbers, or dashes
  const items = text.match(/(?:^|\n)(?:\d+\.|\*|\-|\•)\s*([^\n]+)/g);
  
  if (items && items.length > 0) {
    return items.map(item => {
      // Remove the bullet/number and trim
      return item.replace(/(?:^|\n)(?:\d+\.|\*|\-|\•)\s*/, '').trim();
    }).filter(item => item.length > 0);
  }
  
  // If no bullet points found, split by newlines and filter
  return text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 5); // Require at least 5 chars to be a valid item
} 