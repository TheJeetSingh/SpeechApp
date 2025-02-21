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
      <h1 style={styles.heading}>Speech Timer</h1>
      <div style={styles.timerContainer}>
        <h2 style={styles.subHeading}>Elapsed Time:</h2>
        <p style={styles.timer}>{formatTime(elapsedTime)}</p>
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
    background: "linear-gradient(135deg, #8E2DE2, #4A00E0)",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
    color: "#ffffff",
  },
  heading: {
    fontSize: "2.8rem",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "20px",
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
    backdropFilter: "blur(5px)",
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
    backdropFilter: "blur(5px)",
  },
};

export default SpeechScreen;
