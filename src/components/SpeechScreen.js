import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";
import { FiMic, FiStopCircle, FiDownload, FiVideo, FiInfo } from "react-icons/fi";
import { isMobile } from "react-device-detect";

const getMobileStyles = (baseStyles, mobileStyles) => {
  return isMobile ? { ...baseStyles, ...mobileStyles } : baseStyles;
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
  const [timer, setTimer] = useState(0);
  const [recordingURL, setRecordingURL] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("mp4");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

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
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
      
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      style={{
        ...getMobileStyles(componentStyles.container, {
          padding: "1rem",
        }),
        backgroundColor: "rgba(0, 0, 0, 0.85)",
      }}
      variants={animations.container}
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
        variants={animations.content}
      >
      <motion.h1
        style={styles.heading}
          variants={animations.heading}
      >
          {type || "Speech"} Practice
      </motion.h1>

        <motion.div
          style={styles.topicContainer}
          variants={animations.card}
        >
          <motion.h2 style={styles.topicTitle}>
            Your Topic:
          </motion.h2>
          <motion.p style={styles.topicText}>
            {topicName || "No topic selected"}
          </motion.p>
        </motion.div>

        <motion.div style={styles.videoContainer}>
          <video
            ref={videoRef}
            style={styles.video}
            autoPlay
            muted
            playsInline
          />
        </motion.div>

        <motion.div style={styles.timerContainer}>
          <motion.span style={styles.timer}>
            {formatTime(timer)}
          </motion.span>
        </motion.div>

        <motion.div style={styles.controlsContainer}>
          {!isRecording ? (
          <motion.button
              style={styles.recordButton}
              whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
              onClick={initiateRecording}
          >
              <FiVideo size={24} />
              <span>Start Recording</span>
          </motion.button>
        ) : (
          <motion.button
              style={{...styles.recordButton, background: colors.accent.red}}
              whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
          >
              <FiStopCircle size={24} />
              <span>Stop Recording</span>
          </motion.button>
        )}

          {recordingURL && (
            <AnimatePresence>
        <motion.div
                style={styles.audioContainer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {selectedFormat === "mp4" ? (
                  <video 
                    src={recordingURL} 
                    controls 
                    style={styles.recordingPlayer}
                  />
                ) : (
                  <audio 
                    src={recordingURL} 
                    controls 
                    style={styles.recordingPlayer}
                  />
                )}
                <motion.div style={styles.formatSelector}>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    style={styles.formatSelect}
                  >
                    <option value="mp4">Video (MP4)</option>
                    <option value="wav">Audio (WAV)</option>
                    <option value="m4a">Audio (M4A)</option>
                  </select>
                  <motion.button
                    style={styles.downloadButton}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadRecording}
                  >
                    <FiDownload size={20} />
                    <span>Download Recording</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
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
    background: colors.background.glass,
    padding: "1.5rem",
    borderRadius: "15px",
    marginBottom: "1.5rem",
    backdropFilter: "blur(10px)",
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
    background: colors.background.glass,
    borderRadius: "15px",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
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
    background: colors.background.glass,
    padding: "1rem 2rem",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
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
    gap: "1rem",
  },
  recordingPlayer: {
    width: "100%",
    maxWidth: "500px",
    borderRadius: "25px",
    background: colors.background.glass,
    marginBottom: "1rem",
  },
  formatSelector: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    width: "100%",
    maxWidth: "500px",
  },
  formatSelect: {
    width: "100%",
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    color: colors.text.primary,
    background: colors.background.glass,
    border: "1px solid rgba(255, 255, 255, 0.18)",
    borderRadius: "25px",
    cursor: "pointer",
    outline: "none",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  },
  downloadButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: colors.text.primary,
    background: colors.accent.blue,
    border: "none",
    borderRadius: "25px",
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
};

export default SpeechScreen;
