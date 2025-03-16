import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";

const ExtempPrepScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic } = useParams();
  const topicName = location.state?.topicName || topic;

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
      navigate("/speech", { state: { topicName, type: "Extemp" } });
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, navigate, topicName]);

  const handleStartSpeaking = () => {
    navigate("/speech", { state: { topicName, type: "Extemp" } });
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
          Extemp Preparation
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
            🌍
          </motion.div>
          <motion.h2 style={styles.topicTitle}>
            Your Topic:
          </motion.h2>
          <motion.p style={styles.topicText}>
            {topicName || "No topic selected"}
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
            transition={{ delay: 0.2 }}
          >
            <FiClock size={32} style={{ ...styles.clockIcon, color: getTimerColor() }} />
            <motion.span 
              style={{
                ...styles.timer,
                color: getTimerColor()
              }}
            >
              {formatTime(timer)}
            </motion.span>
          </motion.div>

          <AnimatePresence mode="wait">
            {currentBanner && (
              <motion.div
                key={currentBanner}
                style={styles.banner}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  style={styles.bannerIcon}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {timer > 600 ? <FiCheckCircle size={24} /> : <FiAlertCircle size={24} />}
                </motion.div>
                <motion.p style={styles.bannerText}>
                  {currentBanner}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            style={styles.progressBar}
            initial={{ width: "100%" }}
            animate={{ 
              width: `${(timer / 1800) * 100}%`,
              backgroundColor: getTimerColor()
            }}
            transition={{ duration: 0.5 }}
          />

          <motion.button
            style={styles.startButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartSpeaking}
          >
            Start Speaking
          </motion.button>
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
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "2.5rem",
    borderRadius: "20px",
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
    gap: "1.5rem",
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "2.5rem 3.5rem",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    margin: "0 auto",
  },
  clockIcon: {
    transition: "color 0.3s ease",
  },
  timer: {
    fontSize: "3.5rem",
    fontWeight: "700",
    transition: "color 0.3s ease",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
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
  bannerIcon: {
    color: colors.text.primary,
    flexShrink: 0,
  },
  bannerText: {
    fontSize: "1.2rem",
    color: colors.text.primary,
    margin: 0,
    lineHeight: 1.6,
    flex: 1,
    textAlign: "center",
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: "5%",
    width: "90%",
    height: "4px",
    backgroundColor: colors.accent.blue,
    borderRadius: "2px",
    transition: "width 0.5s ease, background-color 0.3s ease",
    margin: "0 auto",
  },
  startButton: {
    padding: "1.2rem 3rem",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: colors.text.primary,
    background: `linear-gradient(135deg, ${colors.accent.green}, ${colors.accent.blue})`,
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
    margin: "1rem auto",
    display: "block",
  },
};

export default ExtempPrepScreen;
