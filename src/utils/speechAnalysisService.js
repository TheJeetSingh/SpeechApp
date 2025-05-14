import { processAudioWithAssemblyAI } from './assemblyAiApi';
import { generateChatResponse } from './geminiApi';

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
export const analyzeSpeech = async (audioBlob, topic, speechType, speechContext, duration, script = null) => {
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
        poorQuality: true
      };
    }
    
    console.log("Transcript received:", transcript.substring(0, 100) + "...");
    
    // Step 2: Analyze the transcript with Gemini
    console.log("Analyzing transcript with Gemini...");
    
    // Build a comprehensive prompt for Gemini
    let prompt = `
      You are ARTICULATE, an expert AI speech coach. Analyze the following speech transcript and provide detailed, insightful feedback:
      
      Speech Type: ${speechType || "Practice"}
      Topic: "${topic || "General speech"}"
      Duration: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, "0")} minutes
      
      Transcript: "${transcript}"
      
      ${speechContext || ""}
      
      ${script ? `Original Script: "${script}"
      Please compare the transcript with the original script and evaluate adherence.` : ""}
      
      Please analyze:
      1. Clarity and articulation - How clearly did the speaker articulate their points? Were there any pronunciation or enunciation issues?
      2. Pacing and rhythm - Was the speech too fast, too slow, or well-paced? Did the speaker vary their pace effectively?
      3. Filler words - Identify any overused filler words (um, uh, like, you know, etc.) and suggest how to reduce them.
      4. Structure and coherence - Did the speech have a clear beginning, middle, and end? Was there a logical flow?
      5. Delivery style - Comment on voice modulation, emphasis, and emotional connection.
      6. Persuasiveness - How effectively did the speaker make their case? What rhetorical techniques were used or could be added?
      
      Return your response as a JSON object with the following format:
      {
        "contentScore": [number between 0-100],
        "deliveryScore": [number between 0-100],
        "feedback": [overall feedback summary],
        "topic": [analysis of the topic coverage],
        "strengths": [array of strengths],
        "improvements": [array of areas for improvement]
      }
      
      Base the contentScore on the quality, structure, and persuasiveness of the speech content.
      Base the deliveryScore on clarity, pacing, and vocal variety.
      Provide at least 3 specific strengths and 3 areas for improvement.
    `;
    
    // Get analysis from Gemini
    const analysisText = await generateChatResponse([{ sender: "user", text: prompt }]);
    console.log("Received analysis from Gemini");
    
    // Extract JSON from the response
    const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || 
                     analysisText.match(/{[\s\S]*?}/);
    
    let analysisJson;
    
    if (jsonMatch) {
      try {
        // If we found a JSON block, parse it
        const jsonStr = jsonMatch[0].startsWith('{') ? jsonMatch[0] : jsonMatch[1];
        analysisJson = JSON.parse(jsonStr);
      } catch (error) {
        console.error("Error parsing JSON from Gemini response:", error);
        // Extract data using regex as fallback
        analysisJson = extractAnalysisData(analysisText);
      }
    } else {
      // If no JSON block found, extract data using regex
      analysisJson = extractAnalysisData(analysisText);
    }
    
    // Ensure all required fields are present
    const analysis = {
      contentScore: analysisJson.contentScore || 50,
      deliveryScore: analysisJson.deliveryScore || 50,
      feedback: analysisJson.feedback || "Speech analysis completed.",
      topic: analysisJson.topic || "Topic analysis not available.",
      strengths: analysisJson.strengths || ["Speech was analyzed successfully"],
      improvements: analysisJson.improvements || ["Consider practicing more"],
      transcript: transcript // Include the transcript
    };
    
    return analysis;
  } catch (error) {
    console.error("Error in speech analysis:", error);
    throw error;
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