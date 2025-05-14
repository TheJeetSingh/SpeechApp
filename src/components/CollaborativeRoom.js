import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { motion } from 'framer-motion';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff, FiMessageSquare, FiUsers, FiClock } from 'react-icons/fi';

// Agora client configuration
const APP_ID = process.env.REACT_APP_AGORA_APP_ID || '';
const TOKEN = null; // Set to null for development, use a token server in production

const CollaborativeRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [roomName, setRoomName] = useState(`Speech Practice Room ${roomId || '1'}`);
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  
  const client = useRef(null);
  const localUserRef = useRef(null);
  const timerInterval = useRef(null);

  useEffect(() => {
    // Initialize Agora client
    client.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize room
    joinRoom();
    
    return () => {
      // Clean up when component unmounts
      leaveRoom();
    };
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      timerInterval.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(timerInterval.current);
    }

    return () => clearInterval(timerInterval.current);
  }, [isTimerRunning]);

  const setupEventListeners = () => {
    const agoraClient = client.current;
    
    // User published event
    agoraClient.on('user-published', async (user, mediaType) => {
      await agoraClient.subscribe(user, mediaType);
      
      if (mediaType === 'video') {
        setUsers(prevUsers => {
          if (!prevUsers.find(u => u.uid === user.uid)) {
            return [...prevUsers, user];
          }
          return prevUsers;
        });
      }
      
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
      
      setParticipantCount(prev => prev + 1);
    });

    // User unpublished event
    agoraClient.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'audio') {
        user.audioTrack?.stop();
      }
      
      if (mediaType === 'video') {
        setUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
      }
      
      setParticipantCount(prev => Math.max(0, prev - 1));
    });

    // User left event
    agoraClient.on('user-left', (user) => {
      setUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
      setParticipantCount(prev => Math.max(0, prev - 1));
    });
  };

  const joinRoom = async () => {
    try {
      if (!APP_ID) {
        console.error('Agora App ID is missing. Please set your REACT_APP_AGORA_APP_ID in the environment variables.');
        return;
      }

      const uid = await client.current.join(APP_ID, roomId || 'main', TOKEN, null);
      localUserRef.current = uid;

      // Create and publish local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      await client.current.publish([audioTrack, videoTrack]);
      
      setLocalTracks([audioTrack, videoTrack]);
      setUsers(prevUsers => [...prevUsers, { uid, videoTrack, audioTrack }]);
      setJoined(true);
      setParticipantCount(prev => prev + 1);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const leaveRoom = async () => {
    try {
      // Unpublish and stop local tracks
      localTracks.forEach(track => {
        track.stop();
        track.close();
      });
      
      // Leave the channel
      await client.current?.leave();
      setJoined(false);
      setUsers([]);
      setLocalTracks([]);
      setParticipantCount(0);
      clearInterval(timerInterval.current);
      
      // Navigate back to home
      navigate('/');
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const toggleMute = async () => {
    if (localTracks[0]) {
      await localTracks[0].setEnabled(!muted);
      setMuted(!muted);
    }
  };

  const toggleVideo = async () => {
    if (localTracks[1]) {
      await localTracks[1].setEnabled(!videoOff);
      setVideoOff(!videoOff);
    }
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setTimer(0);
    setIsTimerRunning(false);
  };

  const toggleFeedbackMode = () => {
    setFeedbackMode(!feedbackMode);
  };

  const submitFeedback = () => {
    if (feedbackText.trim()) {
      const newFeedback = {
        id: Date.now(),
        text: feedbackText,
        timestamp: timer,
        user: 'You'
      };
      
      setFeedbackList([...feedbackList, newFeedback]);
      setFeedbackText('');
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="collaborative-room" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.roomTitle}>{roomName}</h1>
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <FiUsers style={styles.statIcon} />
            <span>{participantCount}</span>
          </div>
          <div style={styles.statItem}>
            <FiClock style={styles.statIcon} />
            <span>{formatTime(timer)}</span>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.videoGrid}>
          {users.map(user => (
            <div key={user.uid} style={styles.videoContainer}>
              <div 
                style={styles.videoFrame} 
                ref={element => {
                  if (element && user.videoTrack) {
                    user.videoTrack.play(element);
                  }
                }}
              />
              <div style={styles.userName}>
                {user.uid === localUserRef.current ? 'You (Speaker)' : `Participant ${user.uid}`}
              </div>
            </div>
          ))}
        </div>

        {feedbackMode && (
          <div style={styles.feedbackPanel}>
            <h3 style={styles.feedbackTitle}>Real-time Feedback</h3>
            <div style={styles.feedbackList}>
              {feedbackList.map(feedback => (
                <div key={feedback.id} style={styles.feedbackItem}>
                  <div style={styles.feedbackMeta}>
                    <span style={styles.feedbackUser}>{feedback.user}</span>
                    <span style={styles.feedbackTime}>at {formatTime(feedback.timestamp)}</span>
                  </div>
                  <p style={styles.feedbackContent}>{feedback.text}</p>
                </div>
              ))}
            </div>
            <div style={styles.feedbackInput}>
              <input 
                type="text" 
                placeholder="Type feedback here..." 
                value={feedbackText} 
                onChange={e => setFeedbackText(e.target.value)}
                style={styles.textInput}
                onKeyPress={e => e.key === 'Enter' && submitFeedback()}
              />
              <motion.button 
                style={styles.sendButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={submitFeedback}
              >
                Send
              </motion.button>
            </div>
          </div>
        )}
      </div>

      <div style={styles.controls}>
        <motion.button 
          style={{...styles.controlButton, backgroundColor: muted ? '#e74c3c' : '#2ecc71'}}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
        >
          {muted ? <FiMicOff size={24} /> : <FiMic size={24} />}
        </motion.button>

        <motion.button 
          style={{...styles.controlButton, backgroundColor: videoOff ? '#e74c3c' : '#2ecc71'}}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleVideo}
        >
          {videoOff ? <FiVideoOff size={24} /> : <FiVideo size={24} />}
        </motion.button>

        <motion.button 
          style={{...styles.controlButton, backgroundColor: isTimerRunning ? '#f39c12' : '#3498db'}}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTimer}
        >
          <FiClock size={24} />
        </motion.button>

        <motion.button 
          style={{...styles.controlButton, backgroundColor: feedbackMode ? '#9b59b6' : '#3498db'}}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleFeedbackMode}
        >
          <FiMessageSquare size={24} />
        </motion.button>

        <motion.button 
          style={{...styles.controlButton, backgroundColor: '#e74c3c'}}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={leaveRoom}
        >
          <FiPhoneOff size={24} />
        </motion.button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eaeaea',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
  },
  roomTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
  },
  stats: {
    display: 'flex',
    gap: '1rem',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: '#555',
  },
  statIcon: {
    color: '#3498db',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    padding: '1rem',
    gap: '1rem',
    overflow: 'hidden',
  },
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
    flex: 3,
    overflowY: 'auto',
  },
  videoContainer: {
    position: 'relative',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#000',
    aspectRatio: '16/9',
  },
  videoFrame: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  userName: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '0.8rem',
  },
  feedbackPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  feedbackTitle: {
    backgroundColor: '#3498db',
    color: '#fff',
    margin: 0,
    padding: '0.8rem 1rem',
    fontSize: '1rem',
  },
  feedbackList: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
  },
  feedbackItem: {
    marginBottom: '1rem',
    padding: '0.8rem',
    backgroundColor: '#f1f1f1',
    borderRadius: '8px',
  },
  feedbackMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    fontSize: '0.8rem',
    color: '#666',
  },
  feedbackUser: {
    fontWeight: 'bold',
  },
  feedbackTime: {},
  feedbackContent: {
    margin: 0,
    fontSize: '0.9rem',
  },
  feedbackInput: {
    display: 'flex',
    padding: '1rem',
    borderTop: '1px solid #eaeaea',
  },
  textInput: {
    flex: 1,
    padding: '0.8rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '25px',
    outline: 'none',
    fontSize: '0.9rem',
  },
  sendButton: {
    marginLeft: '0.5rem',
    padding: '0.8rem 1.5rem',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#fff',
    borderTop: '1px solid #eaeaea',
  },
  controlButton: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
};

export default CollaborativeRoom; 