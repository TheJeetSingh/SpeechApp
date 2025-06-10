import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";
import { FiClock, FiArrowRight } from "react-icons/fi";

const PrepScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic } = useParams();
  const topicName = location.state?.topicName || topic;

  const [timer, setTimer] = useState(120); // 2-minute prep time
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Prep time banners
  const prepBanners = [
    "Grab a piece of paper to jot down ideas.",
    "Structure your speech with an anecdote, thesis, roadmap, examples, and a call to action.",
    "A memorable anecdote, especially a humorous one, can win over the judges.",
    "Delivery matters as much as your words. Use your voice and gestures effectively.",
    "Keep an eye on the time. Have enough to say, but don't go over.",
    "Use your entire prep time to brainstorm and organize your thoughts.",
    "Stay calm and confident. Studies show we perform worse under pressure.",
    "Use hand gestures to emphasize your points, but avoid overdoing it.",
    "We're nearing the end of prep time. Keep brainstorming!",
    "Include a strong call to action. Why should the audience care?",
    "Lock in. You're going to crush it."
  ];

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      navigate("/speech", { state: { topicName, type: "Impromptu" } });
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, navigate, topicName]);

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % prepBanners.length);
    }, 10000);
    return () => clearInterval(bannerInterval);
  }, [prepBanners.length]);

  // Manually start speech
  const handleStartSpeaking = () => {
    navigate("/speech", { state: { topicName, type: "Impromptu" } });
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
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      />

      <motion.div
        style={styles.content}
        variants={animations.content}
      >
        <motion.h1
          style={styles.heading}
          variants={animations.heading}
        >
          Impromptu Preparation
        </motion.h1>

        <motion.div
          style={styles.topicCard}
          variants={animations.card}
        >
          <h2 style={styles.topicTitle}>
            Your Topic:
          </h2>
          <p style={styles.topicText}>
            {topicName || "No topic selected"}
          </p>
        </motion.div>

        <div style={styles.centerContainer}>
          <motion.div
            style={styles.timerContainer}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FiClock size={32} style={styles.clockIcon} />
            <span 
              style={{
                ...styles.timer,
                color: timer < 30 ? colors.accent.red : colors.text.primary
              }}
            >
              {formatTime(timer)}
            </span>
          </motion.div>

          <div style={styles.bannerContainer}>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentBannerIndex}
                style={styles.bannerText}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
            >
                {prepBanners[currentBannerIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.button
            style={styles.startButton}
            whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${colors.accent.green}` }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartSpeaking}
          >
            Start Speaking
            <FiArrowRight />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  content: {
    ...componentStyles.content,
    zIndex: 1,
  },
  heading: {
    ...componentStyles.heading,
    marginBottom: "2rem",
    background: `linear-gradient(45deg, ${colors.accent.cyan}, ${colors.accent.blue})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },
  topicCard: {
    background: "rgba(10, 25, 47, 0.7)",
    padding: "2rem",
    borderRadius: "15px",
    marginBottom: "2rem",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 20px 0 rgba(0, 0, 0, 0.2)",
    textAlign: 'center',
  },
  topicTitle: {
    fontSize: "1.2rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  topicText: {
    fontSize: "1.5rem",
    fontWeight: '600',
    color: colors.text.primary,
    lineHeight: "1.6",
    margin: 0,
  },
  centerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
  },
  timerContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    background: "rgba(10, 25, 47, 0.7)",
    padding: "1.5rem 2.5rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 20px 0 rgba(0, 0, 0, 0.2)",
  },
  clockIcon: {
    color: colors.accent.cyan,
  },
  timer: {
    fontSize: "3rem",
    fontWeight: "700",
    textShadow: `0 0 15px ${colors.accent.cyan}`,
    transition: 'color 0.3s ease',
  },
  bannerContainer: {
    background: "rgba(10, 25, 47, 0.7)",
    padding: "1.5rem 2rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    minHeight: '80px',
    maxWidth: "600px",
    width: "100%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: "center",
  },
  bannerText: {
    fontSize: "1.1rem",
    fontStyle: 'italic',
    color: colors.text.secondary,
    margin: 0,
    lineHeight: 1.5,
  },
  startButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem 2.5rem",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#fff",
    background: `linear-gradient(45deg, ${colors.accent.green}, ${colors.accent.cyan})`,
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
  },
};

export default PrepScreen;
