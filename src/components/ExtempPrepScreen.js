import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { isMobile } from "react-device-detect";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";

const getMobileStyles = (baseStyles, mobileStyles) => {
  return isMobile ? { ...baseStyles, ...mobileStyles } : baseStyles;
};

const ExtempPrepScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic } = useParams();
  const topicName = location.state?.topicName || decodeURIComponent(topic);
  const type = location.state?.type || "Extemp";

  // Define prepBanners before using it
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

  const [timer, setTimer] = useState(1800); // 30-minute prep time
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(prepBanners[0]);

  useEffect(() => {
    if (!topicName) {
      navigate("/extemp");
      return;
    }
    
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTimer = prev - 1;
          // Rotate banners every 3 minutes
          if (newTimer % 180 === 0) {
            const bannerIndex = Math.floor((1800 - newTimer) / 180);
            if (bannerIndex < prepBanners.length) {
              setCurrentBanner(prepBanners[bannerIndex]);
            }
          }
          return newTimer;
        });
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      navigate("/speech", { 
        state: { 
          topicName,
          type,
          timeSpent: 1800 - timer
        } 
      });
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, navigate, topicName, type, prepBanners]);

  const handleStartSpeaking = () => {
    navigate("/speech", { 
      state: { 
        topicName,
        type,
        timeSpent: 1800 - timer
      } 
    });
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
      style={{
        ...getMobileStyles(componentStyles.container, {
          padding: "1rem",
        }),
        backgroundColor: "rgba(0, 0, 0, 0.85)",
      }}
      variants={animations.container}
      initial="hidden"
      animate="visible"
    >
      <Particles
        id="tsparticles"
        options={isMobile ? {
          ...particlesConfig,
          particles: {
            ...particlesConfig.particles,
            number: {
              ...particlesConfig.particles.number,
              value: 30,
            },
          },
        } : particlesConfig}
      />
      
      <motion.div
        style={getMobileStyles(componentStyles.content, {
          padding: "1rem",
        })}
        variants={animations.content}
      >
        <motion.h1
          style={getMobileStyles(styles.heading, {
            fontSize: "1.8rem",
            marginBottom: "1.5rem",
          })}
          variants={animations.heading}
        >
          Extemp Preparation
        </motion.h1>

        <motion.div
          style={getMobileStyles(styles.topicCard, {
            padding: "1.5rem",
            width: "95%",
            borderRadius: "1rem",
          })}
          variants={animations.card}
        >
          <motion.div 
            style={getMobileStyles(styles.topicIcon, {
              fontSize: "2.5rem",
              marginBottom: "1rem",
            })}
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
          <motion.h2 
            style={getMobileStyles(styles.topicTitle, {
              fontSize: "1.2rem",
              marginBottom: "1rem",
            })}
          >
            Your Topic:
          </motion.h2>
          <motion.p 
            style={getMobileStyles(styles.topicText, {
              fontSize: "1rem",
              padding: "1rem",
            })}
          >
            {topicName || "No topic selected"}
          </motion.p>
        </motion.div>

        <motion.div
          style={getMobileStyles(styles.timerSection, {
            gap: "1.5rem",
            width: "95%",
          })}
          variants={animations.content}
        >
          <motion.div
            style={getMobileStyles(styles.timerContainer, {
              padding: "1.5rem 2rem",
              gap: "1rem",
            })}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FiClock size={isMobile ? 24 : 32} style={{ ...styles.clockIcon, color: getTimerColor() }} />
            <motion.span 
              style={getMobileStyles(styles.timer, {
                fontSize: "2.5rem",
              })}
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
                  {timer > 600 ? <FiCheckCircle size={isMobile ? 20 : 24} /> : <FiAlertCircle size={isMobile ? 20 : 24} />}
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
            style={getMobileStyles(styles.startButton, {
              padding: "1rem 2rem",
              fontSize: "1.1rem",
            })}
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
  heading: getMobileStyles({
    ...componentStyles.heading,
    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
    marginBottom: "clamp(2rem, 5vw, 2.5rem)",
    background: `linear-gradient(45deg, ${colors.text.primary}, ${colors.accent.blue})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "0 1rem",
  }, {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
  }),

  topicCard: getMobileStyles({
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
    padding: "clamp(2rem, 5vw, 2.5rem)",
    borderRadius: "clamp(1rem, 3vw, 1.5rem)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    textAlign: "center",
    maxWidth: "800px",
    width: "90%",
    margin: "0 auto 2rem auto",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  }, {
    padding: "1.5rem",
    width: "95%",
    borderRadius: "1rem",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  }),

  topicIcon: getMobileStyles({
    fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
    marginBottom: "clamp(1rem, 3vw, 1.5rem)",
    display: "block",
    margin: "0 auto",
    color: colors.text.primary,
  }, {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  }),

  topicTitle: getMobileStyles({
    fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
    fontWeight: "600",
    marginBottom: "clamp(1rem, 3vw, 1.5rem)",
    color: colors.text.primary,
    textAlign: "center",
  }, {
    fontSize: "1.2rem",
    marginBottom: "1rem",
  }),

  topicText: getMobileStyles({
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
    color: colors.text.primary,
    lineHeight: "1.6",
    padding: "clamp(1rem, 3vw, 1.5rem)",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "clamp(0.5rem, 2vw, 0.75rem)",
    margin: "0 auto",
    maxWidth: "600px",
    textAlign: "center",
    wordBreak: "break-word",
  }, {
    fontSize: "1rem",
    padding: "1rem",
    lineHeight: "1.4",
  }),

  timerSection: getMobileStyles({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "clamp(1.5rem, 4vw, 2.5rem)",
    width: "90%",
    maxWidth: "800px",
    position: "relative",
    margin: "0 auto",
  }, {
    gap: "1.5rem",
    width: "95%",
  }),

  timerContainer: getMobileStyles({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "clamp(1rem, 3vw, 1.5rem)",
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
    padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(2rem, 5vw, 3.5rem)",
    borderRadius: "clamp(1rem, 3vw, 1.5rem)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    margin: "0 auto",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  }, {
    padding: "1.5rem 2rem",
    gap: "1rem",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  }),

  clockIcon: {
    transition: "color 0.3s ease",
  },

  timer: getMobileStyles({
    fontSize: "clamp(2rem, 6vw, 3.5rem)",
    fontWeight: "700",
    transition: "color 0.3s ease",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    color: colors.text.primary,
  }, {
    fontSize: "2rem",
  }),

  banner: getMobileStyles({
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
    padding: "clamp(1rem, 3vw, 1.5rem)",
    borderRadius: "clamp(0.75rem, 2vw, 1rem)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    width: "90%",
    maxWidth: "800px",
    margin: "1rem auto",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  }, {
    padding: "1rem",
    width: "95%",
    flexDirection: "column",
    gap: "0.75rem",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  }),

  bannerIcon: {
    color: colors.text.primary,
    flexShrink: 0,
  },

  bannerText: getMobileStyles({
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
    color: colors.text.primary,
    margin: 0,
    lineHeight: 1.6,
    flex: 1,
    textAlign: "center",
  }, {
    fontSize: "1rem",
    lineHeight: 1.4,
  }),

  progressBar: {
    position: "absolute",
    bottom: 0,
    left: "5%",
    height: "4px",
    backgroundColor: colors.accent.blue,
    borderRadius: "2px",
    transition: "width 0.5s ease, background-color 0.3s ease",
    margin: "0 auto",
  },

  startButton: getMobileStyles({
    padding: "clamp(1rem, 3vw, 1.2rem) clamp(2rem, 5vw, 3rem)",
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
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
  }, {
    padding: "1rem 2rem",
    fontSize: "1.1rem",
  }),
};

export default ExtempPrepScreen;
