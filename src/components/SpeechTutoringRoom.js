import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { motion } from 'framer-motion';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhone, FiMessageSquare, FiUsers, FiSettings } from 'react-icons/fi';
import '../styles/SpeechTutoringRoom.css';
import { 
  getAgoraAppId, 
  generateUid, 
  isAgoraConfigured, 
  getAgoraToken, 
  shouldUseTokenAuth,
  setAuthenticationMode
} from '../utils/agoraTokens';

// Initialize Agora client
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

// Add error handler for client
client.on('exception', (event) => {
  console.warn(`Agora client exception: ${event.code} - ${event.msg}`);
});

function SpeechTutoringRoom() {
  const navigate = useNavigate();
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [channelName, setChannelName] = useState(`speech-tutoring-${Date.now()}`);
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});

  // Get Agora App ID from environment variables
  const appId = getAgoraAppId();

  // For development, we can use a fixed channel name for testing
  useEffect(() => {
    // Use a simpler channel name in development to avoid issues
    if (process.env.NODE_ENV === 'development') {
      setChannelName('speech-tutoring-test');
    }
  }, []);

  useEffect(() => {
    // Initialize the Agora client
    const init = async () => {
      if (!isAgoraConfigured()) {
        setError('Agora is not configured. Please add your Agora App ID to the .env file.');
        return;
      }

      // Generate a random UID for the user - moved outside try/catch
      const uid = generateUid();
      let token = null;
      let useTokenAuth = true;
      
      try {
        setIsLoading(true);
        
        // Clean up any previous connections
        try {
          await client.leave();
        } catch (e) {
          // Ignore leave errors
        }
        
        // Set up event listeners for remote users
        client.on('user-published', handleUserPublished);
        client.on('user-unpublished', handleUserUnpublished);
        client.on('user-joined', handleUserJoined);
        client.on('user-left', handleUserLeft);
        
        // Check if we should use token authentication
        useTokenAuth = await shouldUseTokenAuth();
        
        // Get a token from the server if needed
        if (useTokenAuth) {
          try {
            console.log('Attempting to get Agora token...');
            token = await getAgoraToken(channelName, uid);
            console.log('Token request result:', token ? 'Success' : 'Failed');
            
            // If token is null in production, this is an error
            if (!token && process.env.NODE_ENV !== 'development') {
              throw new Error('Failed to get token for authentication');
            }
          } catch (tokenError) {
            console.error('Token generation failed:', tokenError);
            
            // In development, we can try without a token
            if (process.env.NODE_ENV === 'development') {
              console.log('Will try to connect without token in development mode');
              useTokenAuth = false;
            } else {
              throw tokenError; // Re-throw in production
            }
          }
        }
        
        console.log(`Joining channel ${channelName}${token ? ' with token' : ' without token'}`);
        
        // Join the channel with or without a token based on what worked
        if (useTokenAuth && token) {
          // Use token authentication (dynamic key)
          console.log('Using token authentication:', token.substring(0, 10) + '...');
          await client.join(appId, channelName, token, uid);
          // Save successful auth mode
          setAuthenticationMode(true);
        } else if (process.env.NODE_ENV === 'development') {
          // In development, try without token (static key)
          console.log('Using App ID only authentication (development mode)');
          await client.join(appId, channelName, null, uid);
          // Save successful auth mode
          setAuthenticationMode(false);
        } else {
          throw new Error('Cannot connect: Token required but not available');
        }
        
        setIsJoined(true);
        
        // Create local audio and video tracks
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        
        // Play local video track
        videoTrack.play(localVideoRef.current);
        
        // Publish local tracks to the channel
        await client.publish([audioTrack, videoTrack]);
        
        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);
        setIsLoading(false);
        
        // Add a welcome message to feedback
        addFeedback('System', 'Welcome to the Speech Tutoring Room! Connect with tutors or practice with peers.');
      } catch (err) {
        console.error('Error initializing Agora client:', err);
        let errorMessage = `Failed to join the tutoring room: ${err.message}`;
        
        // Handle specific error types
        if (err.message && err.message.includes('dynamic use static key')) {
          errorMessage = 'Token authentication failed. Your Agora project requires token authentication.';
          
          // In development, we can try again with a different approach
          if (process.env.NODE_ENV === 'development') {
            console.log('Retrying with different authentication method...');
            
            try {
              // Try the opposite approach
              if (token) {
                // If token failed, try without token
                console.log('Token failed, trying without token');
                await client.join(appId, channelName, null, uid);
                // Save successful auth mode
                setAuthenticationMode(false);
              } else {
                // If no token was used, try getting one
                console.log('No token was used, trying to get one');
                const newToken = await getAgoraToken(channelName, uid);
                if (newToken) {
                  await client.join(appId, channelName, newToken, uid);
                  // Save successful auth mode
                  setAuthenticationMode(true);
                } else {
                  throw new Error('Could not get token');
                }
              }
              
              // If we get here, the retry worked
              setIsJoined(true);
              
              // Create local audio and video tracks
              const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
              const videoTrack = await AgoraRTC.createCameraVideoTrack();
              
              // Play local video track
              videoTrack.play(localVideoRef.current);
              
              // Publish local tracks to the channel
              await client.publish([audioTrack, videoTrack]);
              
              setLocalAudioTrack(audioTrack);
              setLocalVideoTrack(videoTrack);
              setIsLoading(false);
              
              // Add a welcome message to feedback
              addFeedback('System', 'Welcome to the Speech Tutoring Room! Connection established after retry.');
              
              return; // Continue with the rest of the initialization
            } catch (retryErr) {
              console.error('Retry also failed:', retryErr);
              errorMessage += ' Retry also failed.';
            }
          }
        } else if (err.message && err.message.includes('CAN_NOT_GET_GATEWAY_SERVER')) {
          errorMessage = 'Cannot connect to Agora servers. This could be due to network issues or a mismatch in authentication methods.';
        } else if (err.message && err.message.includes('INVALID_OPERATION')) {
          errorMessage = 'Connection already in progress. Please try again.';
        } else if (!appId || appId === 'undefined') {
          errorMessage = 'Agora App ID is not configured properly. Please check your environment variables.';
        }
        
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    init();

    // Clean up function
    return async () => {
      if (localAudioTrack) {
        localAudioTrack.close();
      }
      if (localVideoTrack) {
        localVideoTrack.close();
      }
      
      // Leave the channel
      if (isJoined) {
        await client.leave();
      }
      
      // Remove event listeners
      client.removeAllListeners();
      setRemoteUsers([]);
    };
  }, [appId, channelName]);

  // Handle remote user publishing audio/video
  const handleUserPublished = async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    
    if (mediaType === 'video') {
      // Add remote user to state
      setRemoteUsers(prevUsers => {
        if (prevUsers.some(u => u.uid === user.uid)) {
          return prevUsers.map(u => u.uid === user.uid ? { ...u, videoTrack: user.videoTrack } : u);
        } else {
          return [...prevUsers, { uid: user.uid, videoTrack: user.videoTrack, audioTrack: user.audioTrack }];
        }
      });
      
      // Play remote video when component updates
      setTimeout(() => {
        if (user.videoTrack && remoteVideoRefs.current[user.uid]) {
          user.videoTrack.play(remoteVideoRefs.current[user.uid]);
        }
      }, 100);
      
      addFeedback('System', `A new participant has turned on their camera.`);
    }
    
    if (mediaType === 'audio') {
      // Update remote user's audio track
      setRemoteUsers(prevUsers => {
        if (prevUsers.some(u => u.uid === user.uid)) {
          return prevUsers.map(u => u.uid === user.uid ? { ...u, audioTrack: user.audioTrack } : u);
        } else {
          return [...prevUsers, { uid: user.uid, videoTrack: user.videoTrack, audioTrack: user.audioTrack }];
        }
      });
      
      user.audioTrack.play();
      addFeedback('System', `A new participant has unmuted their microphone.`);
    }
  };

  // Handle remote user unpublishing audio/video
  const handleUserUnpublished = (user, mediaType) => {
    if (mediaType === 'video') {
      setRemoteUsers(prevUsers => 
        prevUsers.map(u => u.uid === user.uid ? { ...u, videoTrack: undefined } : u)
      );
      addFeedback('System', `A participant has turned off their camera.`);
    }
    
    if (mediaType === 'audio') {
      setRemoteUsers(prevUsers => 
        prevUsers.map(u => u.uid === user.uid ? { ...u, audioTrack: undefined } : u)
      );
      addFeedback('System', `A participant has muted their microphone.`);
    }
  };

  // Handle remote user joining
  const handleUserJoined = (user) => {
    addFeedback('System', `A new participant (ID: ${user.uid}) has joined the room.`);
  };

  // Handle remote user leaving
  const handleUserLeft = (user) => {
    setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
    addFeedback('System', `A participant (ID: ${user.uid}) has left the room.`);
  };

  // Toggle microphone
  const toggleMic = async () => {
    if (localAudioTrack) {
      if (isMuted) {
        await localAudioTrack.setEnabled(true);
        setIsMuted(false);
        addFeedback('You', 'You unmuted your microphone.');
      } else {
        await localAudioTrack.setEnabled(false);
        setIsMuted(true);
        addFeedback('You', 'You muted your microphone.');
      }
    }
  };

  // Toggle camera
  const toggleVideo = async () => {
    if (localVideoTrack) {
      if (isVideoOff) {
        await localVideoTrack.setEnabled(true);
        setIsVideoOff(false);
        addFeedback('You', 'You turned on your camera.');
      } else {
        await localVideoTrack.setEnabled(false);
        setIsVideoOff(true);
        addFeedback('You', 'You turned off your camera.');
      }
    }
  };

  // Leave the channel and navigate back
  const leaveChannel = async () => {
    if (localAudioTrack) {
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.close();
    }
    
    await client.leave();
    setIsJoined(false);
    setRemoteUsers([]);
    navigate('/');
  };

  // Add feedback message
  const addFeedback = (sender, message) => {
    setFeedback(prev => [...prev, { sender, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  // Send a chat message
  const sendMessage = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    if (message.trim()) {
      addFeedback('You', message);
      e.target.message.value = '';
    }
  };

  return (
    <div className="speech-tutoring-room">
      <div className="room-header">
        <h1>Speech Tutoring Room</h1>
        <p>Channel: {channelName}</p>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Connecting to the tutoring room...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Go Back</button>
        </div>
      )}

      <div className="video-container">
        {/* Local video */}
        <div className="video-player local-video">
          <div ref={localVideoRef} className="video-element"></div>
          <div className="video-label">
            You {isMuted && <FiMicOff className="icon-small" />}
          </div>
        </div>

        {/* Remote videos */}
        {remoteUsers.map(user => (
          <div key={user.uid} className="video-player remote-video">
            <div 
              ref={el => remoteVideoRefs.current[user.uid] = el} 
              className="video-element"
            ></div>
            <div className="video-label">
              Participant {user.uid} {!user.audioTrack && <FiMicOff className="icon-small" />}
            </div>
          </div>
        ))}
      </div>

      <div className="controls-feedback-container">
        {/* Feedback panel */}
        <div className="feedback-panel">
          <h3><FiMessageSquare /> Chat & Notifications</h3>
          <div className="feedback-messages">
            {feedback.map((item, index) => (
              <div key={index} className={`feedback-message ${item.sender.toLowerCase()}`}>
                <span className="timestamp">{item.timestamp}</span>
                <span className="sender">{item.sender}:</span>
                <span className="message">{item.message}</span>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="message-form">
            <input 
              type="text" 
              name="message" 
              placeholder="Type a message..." 
              autoComplete="off"
            />
            <button type="submit">Send</button>
          </form>
        </div>

        {/* Controls */}
        <div className="controls">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`control-btn ${isMuted ? 'off' : 'on'}`}
            onClick={toggleMic}
          >
            {isMuted ? <FiMicOff /> : <FiMic />}
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`control-btn ${isVideoOff ? 'off' : 'on'}`}
            onClick={toggleVideo}
          >
            {isVideoOff ? <FiVideoOff /> : <FiVideo />}
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="control-btn end-call"
            onClick={leaveChannel}
          >
            <FiPhone />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="control-btn"
          >
            <FiUsers />
            <span className="badge">{remoteUsers.length + 1}</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="control-btn"
          >
            <FiSettings />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default SpeechTutoringRoom; 