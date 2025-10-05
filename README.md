# SpeechApp

A modern, interactive web application for practicing and improving public speaking skills.

## New Feature: AI Speech Analysis

SpeechApp now includes AI-powered speech analysis using AssemblyAI for transcription and Google's Gemini API for coaching. When recording a speech, you can:

1. Record your speech
2. Click "Analyze Speech Content & Delivery" 
3. The app will extract the audio, transcribe it with AssemblyAI, and analyze it with Gemini
4. View detailed AI feedback on your speech content and delivery

### Analysis includes:
- Content score
- Delivery score
- Topic analysis
- Strengths
- Areas for improvement
- Overall feedback

## Environment Setup

1. Copy `.env.example` to create your own `.env` file:
```bash
cp .env.example .env
```

2. Get your API keys:
   - Get a Google Gemini API key from https://aistudio.google.com/app/apikey
   - Get an AssemblyAI API key from https://www.assemblyai.com/dashboard/
   - Add your API keys to the `.env` file:
   ```
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   REACT_APP_ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
   ```

3. **IMPORTANT**: Never commit your `.env` file to version control. It contains sensitive API keys and service credentials that must remain private.

4. Set the secure server-side environment variables before starting the backend service:
   ```
   JWT_SECRET=generate_a_long_random_value
   MONGODB_URI=your_mongodb_connection_string
   NEWS_API_KEY=your_news_api_key
   ASSEMBLYAI_API_KEY=your_assemblyai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-production-domain
   ```
   Adjust the `CORS_ALLOWED_ORIGINS` list to the exact origins that should be able to call the API.

## Installation

```bash
npm install
```

## Running the App

```bash
npm start
```

## Building for Production

```bash
npm run build
```

## Technologies
- React
- Framer Motion
- Express
- Google Gemini API
- AssemblyAI API
- MongoDB

## Note
The speech analysis feature requires an active internet connection and valid API keys.

# Speech App with AI Integration

## AI Integration

This application uses:
- **AssemblyAI** for high-quality speech transcription
- **Google's Gemini AI** for speech coaching and analysis

### Getting Started with API Keys

To use the AI functionality, you'll need to:

1. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the key to your clipboard

2. **Get an AssemblyAI API Key**:
   - Visit [AssemblyAI Dashboard](https://www.assemblyai.com/dashboard/)
   - Sign up or sign in to your account
   - Create a new API key
   - Copy the key to your clipboard

3. **Set up your environment variables**:
   - Copy the `.env.example` file to create a new `.env` file
   - Replace the placeholder values with your actual API keys:
     ```
     REACT_APP_GEMINI_API_KEY=your_actual_gemini_api_key_here
     GEMINI_API_KEY=your_actual_gemini_api_key_here
     REACT_APP_ASSEMBLYAI_API_KEY=your_actual_assemblyai_api_key_here
     ```

4. **Restart your development server** after updating the environment variables.

### Features

The AI-powered speech coach provides:

- **Intelligent Chat Responses**: Ask questions about public speaking techniques, speech preparation, delivery, and receive expert guidance from Gemini.
- **Speech Analysis**: Record your speech directly in the app and receive detailed feedback on:
  - Clarity and articulation
  - Pacing and rhythm
  - Filler words usage
  - Structure and coherence
  - Delivery style
  - The app uses AssemblyAI for accurate speech-to-text transcription and Gemini for expert analysis

### Technical Implementation

- Uses the `@google/generative-ai` SDK to interact with the Gemini API
- Uses AssemblyAI's REST API for high-quality speech transcription
- Supports Markdown formatting in AI responses for better readability
- Provides error handling for API and speech recognition issues

### Usage Tips

- For best results with speech analysis, record in a quiet environment
- Speak clearly and at a moderate pace when recording
- Try asking specific questions about aspects of public speaking you want to improve

### Limitations

- Speech analysis requires an internet connection
- The Gemini and AssemblyAI APIs have rate limits that may apply depending on your usage
- Speech transcription quality may vary depending on your microphone and environment

### Troubleshooting

If you experience issues:

1. Check that your API keys are correctly set in the `.env` file
2. Ensure you have an active internet connection
3. Check your browser's microphone permissions
4. Check the browser console for specific error messages
