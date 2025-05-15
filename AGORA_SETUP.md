# Setting Up Agora WebRTC for Speech Tutoring

This document provides instructions for setting up Agora WebRTC in the Speech App to enable the speech tutoring room feature.

## What is Agora?

Agora is a real-time engagement platform that provides WebRTC (Web Real-Time Communication) capabilities, allowing users to communicate via video and audio directly in the browser without plugins.

## Prerequisites

Before you begin, you need to:

1. Create an Agora account at [https://console.agora.io/](https://console.agora.io/)
2. Create a new project in the Agora Console
3. Get your App ID and App Certificate

## Setup Instructions

### 1. Get Your Agora Credentials

1. Log in to the [Agora Console](https://console.agora.io/)
2. Create a new project or select an existing one
3. Copy your App ID from the project management page
4. Generate an App Certificate for token authentication

### 2. Configure Environment Variables

1. Add Agora credentials to both client and server:

   a. In the root `.env` file (for client):
   ```
   # Agora WebRTC credentials
   REACT_APP_AGORA_APP_ID=your_agora_app_id_here
   REACT_APP_AGORA_APP_CERTIFICATE=your_agora_certificate_here
   ```

   b. In the `Server/.env` file (for server):
   ```
   # Agora WebRTC credentials
   AGORA_APP_ID=your_agora_app_id_here
   AGORA_APP_CERTIFICATE=your_agora_certificate_here
   ```

### 3. Running the Application

1. Install dependencies:
   ```bash
   npm install
   cd Server && npm install && cd ..
   ```

2. Start both client and server:
   ```bash
   npm run dev
   ```

   This will start:
   - React client on http://localhost:3000
   - Express server on http://localhost:5001

### 4. Testing the Speech Tutoring Room

1. Navigate to the home screen
2. Click on the "Speech Tutoring" button
3. Allow camera and microphone permissions when prompted
4. You should now be in a video call room where you can practice speeches with others

## Features

The Speech Tutoring Room includes:

- Real-time video and audio communication
- Mute/unmute audio
- Enable/disable video
- Text chat with other participants
- Leave call functionality
- Participant count display

## Security Implementation

This implementation includes:

1. **Token-Based Authentication**: The server generates secure tokens for each user joining a channel, preventing unauthorized access
2. **Channel Encryption**: Communications are encrypted using Agora's built-in encryption
3. **Server-Side Token Generation**: Tokens are generated on the server, not in the client code
4. **Role-Based Permissions**: Users can be assigned publisher or subscriber roles

## Troubleshooting

If you encounter issues:

1. **Cannot connect to room**: Verify your Agora App ID and Certificate are correctly set in both `.env` files
2. **No video/audio**: Check that you've granted camera and microphone permissions in your browser
3. **Connection errors**: Ensure you have a stable internet connection
4. **Token errors**: Check server logs for token generation issues

## Additional Resources

- [Agora Web SDK Documentation](https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=web)
- [Agora API Reference](https://api-ref.agora.io/en/video-sdk/web/4.x/index.html)
- [Agora Token Authentication](https://docs.agora.io/en/video-calling/develop/authentication-workflow) 