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

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd Server && npm install
   ```
3. Create `.env` files in both root and Server directories with the following:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the development servers:
   ```
   npm run dev
   cd Server && npm start
   ```

## Technologies
- React
- Framer Motion
- Express
- Google Gemini API
- MongoDB

## Note
The speech analysis feature requires an active internet connection and a valid Gemini API key.
