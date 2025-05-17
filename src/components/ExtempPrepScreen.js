import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";

const ExtempPrepScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const topicName = location.state?.topicName;
  const extempType = location.state?.extempType || "NX"; // Default to National Extemp if not specified

  const [timer, setTimer] = useState(1800); // 30-minute prep time
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [currentBanner, setCurrentBanner] = useState("");

  // Extemp prep time banners with more specific guidance
  const prepBanners = [
    "Research Phase: Start gathering evidence and statistics",
    "Outline your main arguments and supporting points",
    "Consider counterarguments and prepare rebuttals",
    "Structure: Introduction → Arguments → Conclusion",
    "Add specific examples from current events",
    "Review your sources and fact-check key points",
    "Practice transitioning between main arguments",
    "Prepare a strong conclusion with clear impact",
    "Review your speech flow and timing",
    "Final check: Evidence, Analysis, Delivery"
  ];

  useEffect(() => {
    // Redirect to topic selection if no topic was provided
    if (!topicName) {
      navigate("/extempTopicSelect", { state: { extempType } });
      return;
    }
    
    // Set the initial banner
    setCurrentBanner(prepBanners[0]);
  }, [topicName, extempType, navigate]);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
        // Rotate banners every 3 minutes
        if (timer % 180 === 0) {
          setCurrentBanner(prepBanners[(1800 - timer) / 180]);
        }
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      navigate("/speech", { state: { topicName, type: "Extemp", extempType } });
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, navigate, topicName, extempType]);

  const handleStartSpeaking = () => {
    navigate("/speech", { state: { topicName, type: "Extemp", extempType } });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timer <= 300) return colors.accent.red; // Last 5 minutes
    if (timer <= 600) return colors.accent.yellow; // Last 10 minutes
    return colors.text.primary;
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
          {extempType === "NX" ? "National Extemp" : "International Extemp"} Preparation
        </motion.h1>

        <motion.div
          style={styles.topicCard}
          variants={animations.card}
        >
          <motion.div 
            style={styles.topicIcon}
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {extempType === "NX" ? "🇺🇸" : "🌍"}
          </motion.div>
          <motion.h2 style={styles.topicTitle}>
            Your Topic:
          </motion.h2>
          <motion.p style={styles.topicText}>
            {topicName}
          </motion.p>
        </motion.div>

        <motion.div
          style={styles.timerSection}
          variants={animations.content}
        >
          <motion.div
            style={styles.timerContainer}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div style={styles.timerIcon}>
              <FiClock size={30} color={getTimerColor()} />
            </motion.div>
            <motion.div 
              style={{
                ...styles.timerDisplay,
                color: getTimerColor()
              }}
            >
              {formatTime(timer)}
            </motion.div>
            <motion.div style={styles.timerControls}>
              <motion.button
                style={styles.timerButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsTimerActive(!isTimerActive)}
              >
                {isTimerActive ? "Pause" : "Resume"}
              </motion.button>
              <motion.button
                style={{
                  ...styles.timerButton,
                  ...styles.startSpeakingButton
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartSpeaking}
              >
                Start Speaking
              </motion.button>
            </motion.div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              style={styles.prepBanner}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div style={styles.bannerIcon}>
                {timer <= 300 ? (
                  <FiAlertCircle size={24} color={colors.accent.red} />
                ) : (
                  <FiCheckCircle size={24} color={colors.accent.green} />
                )}
              </motion.div>
              <motion.p style={styles.bannerText}>
                {currentBanner}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div 
          style={styles.prepTips}
          variants={animations.content}
        >
          <motion.h3 style={styles.tipsTitle}>
            Preparation Tips
          </motion.h3>
          <motion.ul style={styles.tipsList}>
            <motion.li style={styles.tipItem}>
              Begin by researching relevant facts, statistics, and examples.
            </motion.li>
            <motion.li style={styles.tipItem}>
              Structure your speech with a clear introduction, 2-3 main points, and conclusion.
            </motion.li>
            <motion.li style={styles.tipItem}>
              Use specific, current examples to support your arguments.
            </motion.li>
            <motion.li style={styles.tipItem}>
              Consider counterarguments and address them in your speech.
            </motion.li>
            <motion.li style={styles.tipItem}>
              Practice smooth transitions between your main points.
            </motion.li>
          </motion.ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  heading: {
    ...componentStyles.heading,
    marginBottom: "2.5rem",
    background: `linear-gradient(45deg, ${colors.text.primary}, ${colors.accent.blue})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto 2.5rem auto",
  },
  topicCard: {
    background: colors.background.glass,
    padding: "2.5rem",
    borderRadius: "20px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    textAlign: "center",
    maxWidth: "800px",
    width: "90%",
    margin: "0 auto 3rem auto",
  },
  topicIcon: {
    fontSize: "3.5rem",
    marginBottom: "1.5rem",
    display: "block",
    margin: "0 auto 1.5rem auto",
  },
  topicTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    color: colors.text.primary,
    textAlign: "center",
  },
  topicText: {
    fontSize: "1.2rem",
    color: colors.text.secondary,
    lineHeight: "1.6",
    padding: "1.5rem",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    margin: "0 auto",
    maxWidth: "600px",
    textAlign: "center",
  },
  timerSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2.5rem",
    width: "90%",
    maxWidth: "800px",
    position: "relative",
    margin: "0 auto",
  },
  timerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  timerIcon: {
    opacity: 0.9,
  },
  timerDisplay: {
    fontSize: "3rem",
    fontWeight: "700",
    fontFamily: "monospace",
  },
  timerControls: {
    display: "flex",
    gap: "1rem",
  },
  timerButton: {
    background: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.purple})`,
    color: colors.text.primary,
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "50px",
    fontSize: "1.2rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.15)",
  },
  startSpeakingButton: {
    background: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.purple})`,
    color: colors.text.primary,
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "50px",
    fontSize: "1.2rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.15)",
  },
  prepBanner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    padding: "1.5rem",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "15px",
    width: "100%",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
  },
  bannerIcon: {
    color: colors.accent.blue,
  },
  bannerText: {
    fontSize: "1.2rem",
    color: colors.text.primary,
    fontWeight: "500",
  },
  prepTips: {
    padding: "2rem",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    maxWidth: "800px",
    width: "90%",
    margin: "0 auto",
  },
  tipsTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    color: colors.text.primary,
    textAlign: "center",
  },
  tipsList: {
    listStyleType: "disc",
    paddingLeft: "20px",
  },
  tipItem: {
    marginBottom: "0.5rem",
    color: colors.text.secondary,
  },
};

export default ExtempPrepScreen;
