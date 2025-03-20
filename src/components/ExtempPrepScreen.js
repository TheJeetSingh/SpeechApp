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
          style={styles.topicsContainer}
          variants={animations.card}
        >
          <motion.div 
            style={styles.topicCard}
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
          <motion.div style={styles.topicContent}>
            <motion.h2 style={styles.topicTitle}>
              Your Topic:
            </motion.h2>
            <motion.p style={styles.topicText}>
              {topicName || "No topic selected"}
            </motion.p>
          </motion.div>
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
    fontSize: "2.5rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "2rem",
    padding: "1rem 2rem",
    backgroundColor: "rgba(42, 82, 152, 0.95)",
    color: "#FFFFFF",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.5)",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    width: "fit-content",
    margin: "0 auto 2rem",
  },
  topicsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    width: "90%",
    maxWidth: "800px",
    margin: "0 auto",
  },
  topicCard: {
    backgroundColor: "rgba(42, 82, 152, 0.95)",
    padding: "2rem",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.5)",
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  topicIconContainer: {
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: "1rem",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  topicContent: {
    flex: 1,
  },
  topicTitle: {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#FFFFFF",
    margin: "0 0 0.5rem 0",
  },
  topicText: {
    fontSize: "1rem",
    color: "#FFFFFF",
    margin: 0,
    lineHeight: 1.6,
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
    backgroundColor: "rgba(42, 82, 152, 0.95)",
    padding: "1rem 2rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.5)",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
    width: "fit-content",
    margin: "0 auto 2rem",
  },
  clockIcon: {
    color: "#FFFFFF",
  },
  timer: {
    fontSize: "1.8rem",
    fontWeight: "700",
    transition: "color 0.3s ease",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    color: "#FFFFFF",
  },
  banner: {
    backgroundColor: "rgba(42, 82, 152, 0.95)",
    padding: "2rem",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.5)",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.5rem",
    margin: "0 auto",
  },
  bannerIcon: {
    color: "#FFFFFF",
    flexShrink: 0,
  },
  bannerText: {
    fontSize: "1.2rem",
    color: "#FFFFFF",
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
    backgroundColor: "#2196F3",
    borderRadius: "2px",
    transition: "width 0.5s ease, background-color 0.3s ease",
    margin: "0 auto",
  },
  startButton: {
    backgroundColor: "#2196F3",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "50px",
    padding: "1rem 2.5rem",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    marginTop: "1.5rem",
  },
  arrowContainer: {
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    transition: "transform 0.3s ease",
  },
};

export default ExtempPrepScreen;
