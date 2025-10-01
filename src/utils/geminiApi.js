import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key from environment variables
// NOTE: In production, always use environment variables for API keys
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Warning: REACT_APP_GEMINI_API_KEY environment variable is not set");
}

// Initialize the API
const genAI = new GoogleGenerativeAI(API_KEY);

// Get the generative model for chat
const getGeminiProModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
};

// Helper function to check if error is rate limit related
const isRateLimitError = (error) => {
  const errorMessage = error.message?.toLowerCase() || '';
  return (
    errorMessage.includes('429') ||
    errorMessage.includes('quota') ||
    errorMessage.includes('rate limit') ||
    errorMessage.includes('too many requests')
  );
};

// Function to generate a response from Gemini
export const generateChatResponse = async (messages) => {
  if (!API_KEY) {
    throw new Error("No API key provided. Please set the REACT_APP_GEMINI_API_KEY environment variable.");
  }

  try {
    const model = getGeminiProModel();
    
    // Create a system prompt to focus on speech coaching
    const systemPrompt = `
    You are ARTICULATE, an expert AI speech coach focused solely on helping users improve their public speaking skills.

    Your expertise includes:
    - Speech structure and organization
    - Delivery techniques (pacing, tone, volume, etc.)
    - Body language and stage presence
    - Handling speech anxiety and nervousness
    - Rhetorical techniques and persuasive speaking
    - Impromptu speaking strategies
    - Audience engagement tactics
    
    Guidelines:
    1. Keep all responses focused exclusively on public speaking topics.
    2. If a user asks about unrelated topics, politely redirect them to speech-related topics.
    3. Provide specific, actionable advice that can be immediately implemented.
    4. Be encouraging, professional and supportive in your tone.
    5. When appropriate, cite speaking techniques used by renowned orators.
    6. Format your responses clearly with headings, bullet points, and emphasis for better readability.
    7. Never engage with politically divisive, inappropriate, or harmful content.
    8. If asked about non-speech topics, say: "As your speech coach, I'm here to help you with public speaking skills. Let's focus on how I can help you become a better speaker."
    `;
    
    // Format the message history for the Gemini API
    const formattedHistory = messages.map(msg => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));
    
    // Extract the last user message for enhanced prompting
    const lastUserMessage = formattedHistory.filter(msg => msg.role === "user").pop();
    const lastUserText = lastUserMessage ? lastUserMessage.parts[0].text : "";
    
    console.log("Formatted history for Gemini:", formattedHistory);
    
    // Initialize chat with system prompt and history
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello, can you help me with my public speaking?" }],
        },
        {
          role: "model",
          parts: [{ text: "Absolutely! I'm ARTICULATE, your dedicated AI speech coach. I'm here to help you develop and refine your public speaking skills. Whether you're preparing for a presentation, working on speech delivery, or wanting to overcome stage fright, I can provide guidance tailored to your specific needs. What aspect of public speaking would you like to focus on today?" }],
        },
        {
          role: "user", 
          parts: [{ text: "Can you tell me about current events?" }],
        },
        {
          role: "model",
          parts: [{ text: "As your speech coach, I'm here to help you with public speaking skills, not current events. However, I can help you prepare a speech about current events! Would you like tips on how to structure a speech about a timely topic, how to engage an audience when discussing news, or how to research effectively for a current events presentation? Let's focus on how I can help you become a better speaker." }],
        },
        // Add the actual conversation history (excluding the last message)
        ...formattedHistory.slice(0, -1)
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });

    // Send the last message to the chat
    const result = await chat.sendMessage(lastUserText);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating chat response:", error);
    if (isRateLimitError(error)) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    throw error;
  }
};

// Function to generate a speech analysis from Gemini
export const generateSpeechAnalysis = async (transcript) => {
  if (!API_KEY) {
    throw new Error("No API key provided. Please set the REACT_APP_GEMINI_API_KEY environment variable.");
  }

  try {
    const model = getGeminiProModel();
    const prompt = `
      You are ARTICULATE, an expert AI speech coach. Analyze the following speech transcript and provide detailed, insightful feedback:
      
      Transcript: "${transcript}"
      
      Please analyze:
      1. Clarity and articulation - How clearly did the speaker articulate their points? Were there any pronunciation or enunciation issues?
      2. Pacing and rhythm - Was the speech too fast, too slow, or well-paced? Did the speaker vary their pace effectively?
      3. Filler words - Identify any overused filler words (um, uh, like, you know, etc.) and suggest how to reduce them.
      4. Structure and coherence - Did the speech have a clear beginning, middle, and end? Was there a logical flow?
      5. Delivery style - Comment on voice modulation, emphasis, and emotional connection.
      6. Persuasiveness - How effectively did the speaker make their case? What rhetorical techniques were used or could be added?
      
      Format your analysis with clear headings and bullet points. Provide specific, actionable suggestions for improvement in a supportive, encouraging tone. Highlight strengths before addressing weaknesses.
      
      End with a summary of 3 specific tips this speaker can implement immediately to improve.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating speech analysis:", error);
    if (isRateLimitError(error)) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    throw error;
  }
}; 