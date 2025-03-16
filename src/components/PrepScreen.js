import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";
import { FiClock } from "react-icons/fi";

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      style={componentStyles.container}
      variants={animations.container}
      initial="hidden"
      animate="visible"
    >
      <Particles
        id="tsparticles"
        options={particlesConfig}
      />
      
      <motion.div
        style={componentStyles.content}
        variants={animations.content}
      >
        <motion.h1
          style={styles.heading}
          variants={animations.heading}
        >
          Preparation Time
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

        <motion.div style={styles.timerSection}>
          <motion.div
            style={styles.timerContainer}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FiClock size={32} style={styles.clockIcon} />
            <motion.span 
              style={{
                ...styles.timer,
                color: timer < 30 ? colors.accent.red : colors.text.primary
              }}
            >
              {formatTime(timer)}
            </motion.span>
          </motion.div>

          {currentBanner && (
            <motion.div
              style={styles.banner}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.p style={styles.bannerText}>
                {currentBanner}
              </motion.p>
            </motion.div>
          )}

          <motion.button
            style={styles.startButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartSpeaking}
          >
            Start Speaking!
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  heading: {
    ...componentStyles.heading,
    marginBottom: "2rem",
    background: `linear-gradient(45deg, ${colors.text.primary}, ${colors.secondary.main})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },
  topicContainer: {
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "2rem",
    borderRadius: "15px",
    marginBottom: "2rem",
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
  timerSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
  },
  timerContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "2rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },
  clockIcon: {
    color: colors.text.primary,
  },
  timer: {
    fontSize: "3rem",
    fontWeight: "700",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  },
  banner: {
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "1.5rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
  },
  bannerText: {
    fontSize: "1.2rem",
    color: colors.text.primary,
    margin: 0,
    lineHeight: 1.5,
  },
  startButton: {
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
};

export default PrepScreen;
