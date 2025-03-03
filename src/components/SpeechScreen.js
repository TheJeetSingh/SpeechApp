import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function SpeechScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Time in seconds
  const [showPopup, setShowPopup] = useState(false); // Controls popup visibility

  // Retrieve the type from location.state
  const type = location.state?.type || "Unknown";

  useEffect(() => {
    let interval;
    if (startTime) {
      interval = setInterval(() => {
        const time = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(time);

        // Show popup based on the type
        if (type === "Impromptu" && time > 330) {
          setShowPopup(true); // 5 minutes and 30 seconds for Impromptu
        } else if (
          (type === "Interp" || type === "Original") &&
          time > 630
        ) {
          setShowPopup(true); // 10 minutes and 30 seconds for Interp/Original
        } else if (type === "Extemp" && time > 450) {
          setShowPopup(true); // 7 minutes and 30 seconds for Extemp
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, type]);

  const handleStartSpeech = () => {
    setStartTime(Date.now());
    setShowPopup(false); // Reset popup visibility when starting a new speech
  };

  const handleEndSpeech = () => {
    navigate("/");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>ARTICULATE</h1>
      </header>
      <motion.h1
        style={styles.heading}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Get Ready To Speak!
      </motion.h1>
      <div style={styles.timerContainer}>
        <h2 style={styles.subHeading}>Elapsed Time:</h2>
        <p style={styles.timer}>{formatTime(elapsedTime)}</p>
      </div>
      <div style={styles.footer}>
        {!startTime ? (
          <motion.button
            style={styles.startButton}
            onClick={handleStartSpeech}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Speech
          </motion.button>
        ) : (
          <motion.button
            style={styles.endButton}
            onClick={handleEndSpeech}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            End Speech
          </motion.button>
        )}
      </div>

      {/* Display the type */}
      <p style={styles.typeText}>Type: {type}</p>

      {/* Popup for exceeding time */}
      {showPopup && (
        <motion.div
          style={styles.popup}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <p style={styles.popupText}>
            {type === "Impromptu"
              ? "You are above the grace period for Impromptu! Try to finish soon!"
              : type === "Extemp"
              ? "You are above the grace period for Extemp! Try to finish soon!"
              : "You are above the grace period! Try to finish soon!"}
          </p>
        </motion.div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
    color: "#ffffff",
    position: "relative", // Needed for positioning the popup
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#1e3c72",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 4000,
  },
  headerTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
  },
  heading: {
    fontSize: "3.5rem",
    fontWeight: "700",
    marginBottom: "20px",
    letterSpacing: "1px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    marginTop: "100px",
  },
  timerContainer: {
    background: "rgba(255, 255, 255, 0.15)",
    padding: "20px 40px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(8px)",
  },
  subHeading: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "10px",
  },
  timer: {
    fontSize: "2rem",
    fontWeight: "700",
    padding: "10px 20px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "10px",
    boxShadow: "0 3px 8px rgba(255, 255, 255, 0.2)",
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "30px",
    gap: "20px",
  },
  startButton: {
    fontSize: "1.3rem",
    padding: "14px 35px",
    borderRadius: "30px",
    background: "rgba(0, 255, 127, 0.8)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 6px 20px rgba(0, 255, 127, 0.4)",
    transition: "0.3s ease",
  },
  endButton: {
    fontSize: "1.3rem",
    padding: "14px 35px",
    borderRadius: "30px",
    background: "rgba(255, 69, 58, 0.8)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 6px 20px rgba(255, 69, 58, 0.4)",
    transition: "0.3s ease",
  },
  typeText: {
    fontSize: "1.2rem",
    fontWeight: "500",
    marginTop: "20px",
  },
  popup: {
    position: "absolute",
    top: "80px", // Adjusted the popup's vertical position
    right: "20px",
    background: "rgba(255, 69, 58, 0.9)",
    padding: "15px 25px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(255, 69, 58, 0.3)",
    backdropFilter: "blur(5px)",
  },
  popupText: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#ffffff",
    margin: "0",
  },
};

export default SpeechScreen;
