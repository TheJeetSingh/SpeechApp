import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PrepScreen = () => {
  const location = useLocation();
  const { topicName } = location.state || {}; // Retrieve topicName from state
  const [timer, setTimer] = useState(120); // 2-minute timer for prep time
  const [isTimerActive, setIsTimerActive] = useState(true);
  const navigate = useNavigate();

  // Timer countdown logic
  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      navigate("/speech", { state: { topicName } }); // Pass topicName to speech screen
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, navigate, topicName]);

  // Handle when the user clicks to start the speech manually
  const handleStartSpeaking = () => {
    navigate("/speech", { state: { topicName } }); // Pass topicName to speech screen
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
          {topicName && (
            <>
              <h2 style={styles.subHeading}>Topic:</h2>
              <p style={styles.contentText}>{topicName}</p>
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
    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
    padding: "40px",
    fontFamily: "'Inter', sans-serif",
    color: "#fff",
    textAlign: "center",
  },
  timerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "40px",
  },
  timer: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#fff",
    background: "rgba(255, 215, 0, 0.9)", // Gold for visibility
    padding: "16px 32px",
    borderRadius: "50px",
    boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
  },
  timerLabel: {
    fontSize: "1.1rem",
    fontWeight: "500",
    color: "#ddd",
    letterSpacing: "0.5px",
  },
  contentContainer: {
    marginBottom: "40px",
    maxWidth: "600px",
    width: "100%",
  },
  heading: {
    fontSize: "2.8rem",
    fontWeight: "800",
    marginBottom: "24px",
    letterSpacing: "-0.5px",
  },
  subHeading: {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "16px",
  },
  contentText: {
    fontSize: "1.3rem",
    padding: "16px",
    background: "rgba(255, 255, 255, 0.2)", // Frosted glass effect
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
    margin: "16px 0",
    textAlign: "center",
    lineHeight: "1.6",
  },
  contentBox: {
    background: "rgba(255, 255, 255, 0.15)",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(8px)",
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "40px",
  },
  startButton: {
    fontSize: "1.4rem",
    padding: "16px 40px",
    borderRadius: "50px",
    background: "#FFD700", // Gold button
    color: "#000",
    fontWeight: "700",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
    transition: "background-color 0.3s ease, transform 0.3s ease",
  },
};

export default PrepScreen;
