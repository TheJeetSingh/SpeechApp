# SpeechApp

A modern, interactive web application for practicing and improving public speaking skills.

## New Feature: AI Speech Analysis

SpeechApp now includes AI-powered speech analysis using Google's Gemini API. When recording a speech, you can:

1. Record your speech
2. Click "Analyze Speech Content & Delivery" 
3. The app will extract the audio and send it to Gemini for analysis
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
   - Add your API key to the `.env` file:
   ```
   REACT_APP_GEMINI_API_KEY=your_api_key_here
   ```

3. Never commit your `.env` file to version control!

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
- MongoDB

## Note
The speech analysis feature requires an active internet connection and a valid Gemini API key.

# Speech App with Gemini AI Integration

## Gemini API Integration

This application now uses Google's Gemini AI API to power the chat interface, providing intelligent responses to user questions about public speaking and analyzing speech recordings.

### Getting Started with Gemini API

To use the Gemini API functionality, you'll need to:

1. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the key to your clipboard

2. **Set up your environment variables**:
   - Open the `.env` file in the root of the project
   - Replace `your_gemini_api_key_here` with your actual API key:
     ```
     REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
     ```

3. **Restart your development server** after updating the environment variables.

### Features

The Gemini-powered AI coach provides:

- **Intelligent Chat Responses**: Ask questions about public speaking techniques, speech preparation, delivery, and receive expert guidance.
- **Speech Analysis**: Record your speech directly in the app and receive detailed feedback on:
  - Clarity and articulation
  - Pacing and rhythm
  - Filler words usage
  - Structure and coherence
  - Delivery style

### Technical Implementation

- Uses the `@google/generative-ai` SDK to interact with the Gemini API
- Implements the Speech Recognition API for real-time speech-to-text transcription
- Supports Markdown formatting in AI responses for better readability
- Provides error handling for API and speech recognition issues

### Usage Tips

- For best results with speech analysis, record in a quiet environment
- Speak clearly and at a moderate pace when recording
- Try asking specific questions about aspects of public speaking you want to improve

### Limitations

- The Speech Recognition API is only available in Chrome, Edge, Safari, and some other Chromium-based browsers
- The Gemini API has rate limits that may apply depending on your usage
- Speech transcription quality may vary depending on your microphone and environment

### Troubleshooting

If you experience issues:

1. Check that your API key is correctly set in the `.env` file
2. Ensure your browser supports the Speech Recognition API
3. Check your browser's microphone permissions
4. Check the browser console for specific error messages
