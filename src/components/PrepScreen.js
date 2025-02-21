import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PrepScreen = () => {
  const location = useLocation();
  const { topicName, quoteText } = location.state || {};
  const [timer, setTimer] = useState(120); // 1-minute timer for prep time
  const [isTimerActive, setIsTimerActive] = useState(true);
  const navigate = useNavigate();

  // Timer logic for prep time countdown
  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      navigate("/speech");
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // Handle when the user clicks to start the speech
  const handleStartSpeaking = () => {
    // Navigate to SpeechScreen and pass the topic or quote
    navigate("/speech", {
      state: {
        topicName: topicName || quoteText,
      },
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.timerContainer}>
        <div style={styles.timer}>Prep Time: {timer}s</div>
        <div style={styles.timerLabel}>Get ready to present your {topicName ? "topic" : "quote"}!</div>
      </div>
      <div style={styles.contentContainer}>
        <h1 style={styles.heading}>Prepare Your Speech</h1>
        <div style={styles.contentBox}>
          {topicName ? (
            <>
              <h2 style={styles.subHeading}>Concrete Topic:</h2>
              <p style={styles.contentText}>{topicName}</p>
            </>
          ) : (
            <>
              <h2 style={styles.subHeading}>Quote:</h2>
              <p style={styles.contentText}>{quoteText}</p>
            </>
          )}
        </div>
      </div>
      <div style={styles.footer}>
        <button style={styles.startButton} onClick={handleStartSpeaking}>
          Start Speaking!
        </button>
      </div>
    </div>
  );
};

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
  timerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
  },
  timer: {
    fontSize: "2rem",
    fontWeight: "600",
    color: "#e74c3c",
    backgroundColor: "#fff",
    padding: "12px 24px",
    borderRadius: "30px",
    marginBottom: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  timerLabel: {
    fontSize: "1.2rem",
    fontWeight: "500",
    color: "#7f8c8d",
  },
  contentContainer: {
    marginBottom: "40px",
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
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    margin: "10px 0",
    textAlign: "center",
  },
  contentBox: {
    backgroundColor: "#ecf0f1",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
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
};

export default PrepScreen;
