import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";
import { FiMic, FiStopCircle, FiDownload, FiVideo, FiInfo, FiBarChart2 } from "react-icons/fi";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const pulseVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const recordingVariants = {
  initial: { scale: 1 },
  recording: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Disclaimer Modal Component
function DisclaimerModal({ isOpen, onClose, onAccept }) {
  if (!isOpen) return null;

  return (
    <motion.div
      style={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={styles.modalContent}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <h2 style={styles.modalTitle}>Privacy Notice</h2>
        <div style={styles.modalBody}>
          <FiInfo size={24} style={{ color: colors.accent.blue }} />
          <p style={styles.modalText}>
            Your video will only be shown locally in your browser and will not be saved or uploaded anywhere. 
            The video will be available for download after recording.
          </p>
        </div>
        <div style={styles.modalButtons}>
          <motion.button
            style={{...styles.modalButton, background: colors.accent.green}}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAccept}
          >
            I Understand, Start Recording
          </motion.button>
          <motion.button
            style={{...styles.modalButton, background: colors.accent.red}}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SpeechScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topicName, type } = location.state || {};
  const [isRecording, setIsRecording] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [recordingURL, setRecordingURL] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("mp4");
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Check camera permission on component mount
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasCameraPermission(true);
    } catch (error) {
      console.log("Camera permission denied:", error);
      setHasCameraPermission(false);
      setIsPracticeMode(true);
    }
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    // Clean up video stream when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initiateRecording = () => {
    setShowDisclaimer(true);
  };

  const getFileExtension = () => {
    switch (selectedFormat) {
      case "mp4":
        return "mp4";
      case "wav":
        return "wav";
      case "m4a":
        return "m4a";
      default:
        return "mp4";
    }
  };

  const getMimeType = () => {
    switch (selectedFormat) {
      case "mp4":
        return "video/mp4";
      case "wav":
        return "audio/wav";
      case "m4a":
        return "audio/mp4";
      default:
        return "video/mp4";
    }
  };

  const sanitizeFileName = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric chars with underscore
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream, {
        mimeType: getMimeType()
      });
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: getMimeType() });
        const url = URL.createObjectURL(blob);
        setRecordingURL(url);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setTimer(0);
      setIsTimerRunning(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setHasCameraPermission(false);
      setIsPracticeMode(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsCompleted(true);
      setIsTimerRunning(false);
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Clear video preview
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const downloadRecording = () => {
    if (recordingURL) {
      const sanitizedTopic = sanitizeFileName(topicName || "speech");
      const timestamp = new Date().toISOString().slice(0, 10);
      const fileName = `${sanitizedTopic}_${timestamp}.${getFileExtension()}`;
      
      const a = document.createElement("a");
      a.href = recordingURL;
      a.download = fileName;
      a.click();
    }
  };

  const viewStats = () => {
    navigate('/stats', {
      state: {
        timeInSeconds: timer,
        speechType: type
      }
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      style={componentStyles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Particles
        id="tsparticles"
        options={particlesConfig}
      />
      
      <AnimatePresence>
        <DisclaimerModal
          isOpen={showDisclaimer}
          onClose={() => setShowDisclaimer(false)}
          onAccept={() => {
            setShowDisclaimer(false);
            startRecording();
          }}
        />
      </AnimatePresence>

      <motion.div
        style={componentStyles.content}
        variants={containerVariants}
      >
        <motion.h1
          style={styles.heading}
          variants={itemVariants}
        >
          {type || "Speech"} Practice
        </motion.h1>

        <motion.div
          style={styles.topicContainer}
          variants={itemVariants}
        >
          <motion.h2 style={styles.topicTitle}>
            Your Topic:
          </motion.h2>
          <motion.p style={styles.topicText}>
            {topicName || "No topic selected"}
          </motion.p>
        </motion.div>

        {!isPracticeMode && hasCameraPermission && (
          <motion.div 
            style={styles.videoContainer}
            variants={recordingVariants}
            animate={isRecording ? "recording" : "initial"}
          >
            <video
              ref={videoRef}
              style={styles.video}
              autoPlay
              muted
              playsInline
            />
          </motion.div>
        )}

        <motion.div 
          style={styles.timerContainer}
          variants={itemVariants}
          animate={isTimerRunning ? pulseVariants.animate : pulseVariants.initial}
        >
          <motion.span style={styles.timer}>
            {formatTime(timer)}
          </motion.span>
        </motion.div>

        <motion.div 
          style={styles.controlsContainer}
          variants={itemVariants}
        >
          {!isPracticeMode ? (
            <>
              {!isRecording ? (
                <motion.button
                  style={styles.recordButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={initiateRecording}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <FiVideo size={24} />
                  </motion.div>
                  <span>Start Recording</span>
                </motion.button>
              ) : (
                <motion.button
                  style={{...styles.recordButton, background: colors.accent.red}}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopRecording}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <FiStopCircle size={24} />
                  </motion.div>
                  <span>Stop Recording</span>
                </motion.button>
              )}

              {recordingURL && (
                <AnimatePresence>
                  <motion.div
                    style={styles.downloadContainer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.select
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                      style={styles.formatSelect}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <option value="mp4">Video (MP4)</option>
                      <option value="wav">Audio (WAV)</option>
                      <option value="m4a">Audio (M4A)</option>
                    </motion.select>

                    <motion.button
                      style={styles.downloadButton}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={downloadRecording}
                    >
                      <FiDownload size={24} />
                      <span>Download Recording</span>
                    </motion.button>
                  </motion.div>
                </AnimatePresence>
              )}
            </>
          ) : (
            <motion.div
              style={styles.practiceControls}
              variants={itemVariants}
            >
              {!isTimerRunning ? (
                <motion.button
                  style={styles.timerButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsTimerRunning(true);
                    setTimer(0);
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <FiMic size={24} />
                  </motion.div>
                  <span>Start Timer</span>
                </motion.button>
              ) : (
                <motion.button
                  style={{...styles.timerButton, background: colors.accent.red}}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsTimerRunning(false);
                    setIsCompleted(true);
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <FiStopCircle size={24} />
                  </motion.div>
                  <span>Stop Timer</span>
                </motion.button>
              )}
            </motion.div>
          )}

          {isCompleted && (
            <motion.button
              style={styles.statsButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={viewStats}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FiBarChart2 size={24} />
              <span>View Speech Stats</span>
            </motion.button>
          )}
        </motion.div>

        <motion.div
          style={styles.modeToggle}
          variants={itemVariants}
        >
          <motion.button
            style={{
              ...styles.modeButton,
              background: isPracticeMode ? colors.accent.blue : colors.background.glass
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsPracticeMode(!isPracticeMode);
              if (isRecording) {
                stopRecording();
              }
              setIsTimerRunning(false);
              setTimer(0);
            }}
          >
            {isPracticeMode ? "Switch to Recording Mode" : "Switch to Practice Mode"}
          </motion.button>
        </motion.div>

        <motion.button
          style={styles.backButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

const styles = {
  heading: {
    ...componentStyles.heading,
    marginBottom: "1rem",
    background: `linear-gradient(45deg, ${colors.text.primary}, ${colors.secondary.main})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },
  topicContainer: {
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "1.5rem",
    borderRadius: "15px",
    marginBottom: "1.5rem",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },
  topicTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "1rem",
    color: colors.text.primary,
  },
  topicText: {
    fontSize: "1.2rem",
    color: colors.text.secondary,
    lineHeight: "1.6",
  },
  videoContainer: {
    width: "100%",
    maxWidth: "640px",
    aspectRatio: "16/9",
    margin: "0 auto 1.5rem auto",
    background: 'rgba(42, 82, 152, 0.95)',
    borderRadius: "15px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  timerContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem",
  },
  timer: {
    fontSize: "3rem",
    fontWeight: "700",
    color: colors.text.primary,
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "1rem 2rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },
  controlsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    marginBottom: "1.5rem",
  },
  recordButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem 2rem",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: colors.text.primary,
    background: colors.accent.green,
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
  },
  audioContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    marginTop: "2rem",
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "2rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },
  recordingPlayer: {
    width: "100%",
    maxWidth: "500px",
    borderRadius: "15px",
    background: "rgba(255, 255, 255, 0.1)",
    marginBottom: "1rem",
    border: "1px solid rgba(255, 255, 255, 0.18)",
  },
  formatSelector: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    width: "100%",
    maxWidth: "500px",
    marginTop: "1rem",
  },
  formatSelect: {
    width: "100%",
    padding: "1rem 1.5rem",
    fontSize: "1.1rem",
    color: colors.text.primary,
    background: colors.accent.red,
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "15px",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.3s ease",
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    textAlign: "center",
  },
  downloadButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    width: "100%",
    padding: "1.2rem 2rem",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: colors.text.primary,
    background: colors.accent.red,
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
  },
  backButton: {
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: colors.text.primary,
    background: colors.primary.light,
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(5px)",
  },
  modalContent: {
    background: colors.background.glass,
    padding: "2rem",
    borderRadius: "15px",
    maxWidth: "500px",
    width: "90%",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  modalBody: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
    marginBottom: "1.5rem",
  },
  modalText: {
    fontSize: "1rem",
    color: colors.text.secondary,
    lineHeight: 1.6,
    margin: 0,
  },
  modalButtons: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },
  modalButton: {
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: colors.text.primary,
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
  },
  modeToggle: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem",
  },
  modeButton: {
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: colors.text.primary,
    border: "1px solid rgba(255, 255, 255, 0.18)",
    borderRadius: "25px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
  },
  practiceControls: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem",
  },
  timerButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem 2rem",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: colors.text.primary,
    background: colors.accent.green,
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
  },
  downloadContainer: {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "2rem",
    padding: "1.5rem",
    background: 'rgba(42, 82, 152, 0.95)',
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },
  statsButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    padding: "1.2rem 2rem",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: colors.text.primary,
    background: colors.accent.blue,
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
    marginTop: "1.5rem",
    width: "100%",
    justifyContent: "center",
  },
};

export default SpeechScreen;
