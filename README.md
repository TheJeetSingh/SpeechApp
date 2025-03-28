# Introduction

Articulate was designed with the one singular goal that I had, to make my speeches as good as possible. However after sitting at the original purple-yellow page for days, I realized that it had potential to help people in my school and then after talking to an advisor, I realized that this app had the potential not just change my competitive speech leauge but to help people all over the world to refine their skills and get better at speech. But this app extends way beyond just competitive speech. Whether you realize it or not, speech and in general public speaking is an important part of daily life. The skills that you gain from speech can help in acheiving a job much like how being bilingual can help you secure one. In-fact multiple studies show that in careers that are relavant to speech a prior public speaking experience can boost your salary by 10%.

# My Story

In the 2024-2025 speech season I competed in a ton of speech tournaments, breaking at none. I competed in the impromptu branch, which was highly competitive or I was just really bad at speech. For whatever reason, I decided to basically give up and not really practice for speech after failing to break multiple times. However, before my last tournament, the Berkely Invitational, I was determined to break and so I decided to give it my "all" and give the best speeches possible. I practiced for a day and I thought I came out sounding pretty well. In-fact the day before the tournament there I "saw" a visible difference in my speeches and especially in the one field I lacked, Delivery. I was able to deliver speeches and I was very confident in my ability to do so. So the day of the tournament came and I was super confident in all my speeches but when I went up to give my speeches I didn't give the kinds of speeches I was when I was practicing. So after I had given my four preliminary speeches I was confident that I was absolutely not going to break. I could blame anyone or anything but it was quite obvious that I was just trash at speech and that practicing speech for 15 minutes the day before the tournament wasn't really practice. Now I had pretty much realized that my entire speech season was a bust and I looked pretty much like an incompetent idiot. That's when I realized that I needed to make a change to my practice structure. So I looked at the different ways to practice, all of which included a random word generator. Ok great what do I do from there? All the word generator sites I looked at were either very bland, or was an art project with all the different colors. Another problem? I wanted all the features in one app, I didn't want to have to open the clock app to turn on the timer and I wanted the authentic tournament experience. So I decided that I had enough time in ski break to make one. And now you're here. Enjoy this app and make the most of it and hopefully we'll both break next year.

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