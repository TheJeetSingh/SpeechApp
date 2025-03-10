import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const PrepScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic } = useParams();
  const topicName = location.state?.topicName || topic;

  const [timer, setTimer] = useState(120); // 2-minute prep time
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [currentBanner, setCurrentBanner] = useState("");

  // Prep time banners
  const prepBanners = [
    "Grab a piece of paper to jot down ideas",
    "I like to structure my speeches with Anecdote, Thesis, Roadmap, Examples 1 - 3, and Call to Action",
    "Judges really love an interesting anecdote, especially when they're funny",
    "Remember your delivery matters too! Maybe more than your actual words",
    "Time matters! Make sure you have enough to say but not too much!",
    "Keep going, use your entire prep time.",
    "Don't be too nervous, studies show we perform worse under pressure",
    "Remember certain hand gestures can help emphasize your points but not too many",
    "We're nearing the end of prep time, keep brainstorming",
    "Remember to include a call to action. Why does your speech matter?",
    "Lock in. You're going to crush it."
  ];

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
        // Rotate banners every 10 seconds
        if (timer % 10 === 0) {
          setCurrentBanner(prepBanners[(120 - timer) / 10]);
        }
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      navigate("/speech", { state: { topicName, type: "Impromptu" } }); // Pass "Impromptu" tag
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, navigate, topicName]);

  // Manually start speech
  const handleStartSpeaking = () => {
    navigate("/speech", { state: { topicName, type: "Impromptu" } }); // Pass "Impromptu" tag
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>ARTICULATE</h1>
      </div>

      <motion.h1
        style={styles.heading}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Prepare Your Speech
      </motion.h1>

      <div style={styles.timerContainer}>
        <div style={styles.timer}>Prep Time: {timer}s</div>
        <div style={styles.timerLabel}>
          Get ready to present your topic: <strong>{topicName || "No topic selected"}</strong>
        </div>
      </div>

      {/* Helpful Banner placed here */}
      {currentBanner && (
        <div style={styles.banner}>
          <p style={styles.bannerText}>{currentBanner}</p>
        </div>
      )}

      <div style={styles.contentContainer}>
        {topicName ? (
          <>
            <h2 style={styles.subHeading}>Your Topic:</h2>
            <p style={styles.contentText}>{topicName}</p>
          </>
        ) : (
          <p style={styles.contentText}>No topic available.</p>
        )}
      </div>

      <div style={styles.footer}>
        <button style={styles.startButton} onClick={handleStartSpeaking}>
          Start Speaking!
        </button>
      </div>
    </div>
  );
};

// Styles to match HomeScreen, using only blue and white
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)", // Blue gradient background
    color: "#fff",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#1e3c72", // Blue header background
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "40px",
    background: "rgba(0, 0, 0, 0.4)", // Dark background for the timer container
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  },
  timer: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#fff",
    background: "rgba(255, 255, 255, 0.3)", // Semi-transparent white background for visibility
    padding: "16px 32px",
    borderRadius: "50px",
    boxShadow: "0 4px 15px rgba(255, 255, 255, 0.3)",
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
  subHeading: {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "16px",
  },
  contentText: {
    fontSize: "1.3rem",
    padding: "16px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
    margin: "16px 0",
    textAlign: "center",
    lineHeight: "1.6",
  },
  banner: {
    background: "rgba(255, 255, 255, 0.9)",
    padding: "12px 24px",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(5px)",
    animation: "fadeIn 0.5s ease",
  },
  bannerText: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#333",
    margin: "0",
  },
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: "10px 0",
    background: "#1e3c72", // Blue footer background
    textAlign: "center",
    boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.2)",
  },
  startButton: {
    fontSize: "1.4rem",
    padding: "16px 40px",
    borderRadius: "50px",
    background: "#2a5298", // Darker blue button
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 4px 15px rgba(42, 82, 152, 0.3)",
    transition: "background-color 0.3s ease, transform 0.3s ease",
  },
};

export default PrepScreen;
