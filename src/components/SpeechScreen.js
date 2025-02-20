import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SpeechScreen() {
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Time in seconds
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  const handleStartSpeech = () => {
    setStartTime(Date.now());
  };

  const handleEndSpeech = () => {
    navigate("/speech-stats", {
      state: { duration: elapsedTime }, // Pass the duration in seconds
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Speech Screen</h1>
      <div style={styles.contentContainer}>
        <h2 style={styles.subHeading}>Elapsed Time:</h2>
        <p style={styles.contentText}>{formatTime(elapsedTime)}</p>
      </div>
      <div style={styles.footer}>
        {!startTime ? (
          <button style={styles.startButton} onClick={handleStartSpeech}>
            Start Speech
          </button>
        ) : (
          <button style={styles.endButton} onClick={handleEndSpeech}>
            End Speech
          </button>
        )}
      </div>
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
    backgroundColor: "#f7f8f9",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontFamily: "Roboto, sans-serif",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  subHeading: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#34495e",
    marginBottom: "10px",
  },
  contentText: {
    fontSize: "1.2rem",
    color: "#2c3e50",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    margin: "10px 0",
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "30px",
  },
  startButton: {
    fontSize: "1.3rem",
    padding: "12px 30px",
    borderRadius: "30px",
    backgroundColor: "#3498db",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease, transform 0.3s ease",
  },
  endButton: {
    fontSize: "1.3rem",
    padding: "12px 30px",
    borderRadius: "30px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease, transform 0.3s ease",
  },
};

export default SpeechScreen;
