import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { FiClock, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { isMobile } from "react-device-detect";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";

const PrepScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [timer, setTimer] = useState(120); // 2 minutes for prep
  const [isTimerActive, setIsTimerActive] = useState(true);
  const quoteText = location.state?.quoteText || "Default quote text";

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      navigate("/speech");
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getMobileStyles = (baseStyles, mobileStyles) => {
    return isMobile ? { ...baseStyles, ...mobileStyles } : baseStyles;
  };

  const styles = {
    heading: getMobileStyles({
      ...componentStyles.heading,
      fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
      marginBottom: "clamp(1.5rem, 4vw, 2.5rem)",
      background: `linear-gradient(45deg, ${colors.text.primary}, ${colors.accent.purple})`,
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

    timerContainer: getMobileStyles({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "clamp(0.5rem, 2vw, 1rem)",
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
      padding: "clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 4vw, 2.5rem)",
      borderRadius: "50px",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      width: "fit-content",
      margin: "0 auto clamp(1.5rem, 4vw, 3rem) auto",
    }, {
      padding: "1rem 1.5rem",
      gap: "0.5rem",
    }),

    clockIcon: getMobileStyles({
      color: colors.text.primary,
      width: "clamp(20px, 4vw, 24px)",
      height: "clamp(20px, 4vw, 24px)",
    }, {
      width: "20px",
      height: "20px",
    }),

    timer: getMobileStyles({
      fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
      fontWeight: "700",
      transition: "color 0.3s ease",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    }, {
      fontSize: "1.2rem",
    }),

    quoteContainer: getMobileStyles({
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
      padding: "clamp(2rem, 5vw, 3rem)",
      borderRadius: "clamp(1rem, 3vw, 1.5rem)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      width: "90%",
      maxWidth: "800px",
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(255, 255, 255, 0.05)",
        zIndex: -1,
      },
    }, {
      padding: "1.5rem",
      width: "95%",
      borderRadius: "1rem",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    }),

    quoteText: getMobileStyles({
      fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
      color: colors.text.primary,
      lineHeight: 1.6,
      margin: 0,
      textAlign: "center",
      fontStyle: "italic",
      wordBreak: "break-word",
    }, {
      fontSize: "1.1rem",
      lineHeight: 1.4,
    }),

    buttonContainer: getMobileStyles({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "90%",
      maxWidth: "800px",
      margin: "2rem auto 0",
      gap: "1rem",
    }, {
      width: "95%",
      margin: "1.5rem auto 0",
    }),

    button: getMobileStyles({
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
      padding: "clamp(0.75rem, 2vw, 1rem) clamp(1.25rem, 3vw, 1.5rem)",
      borderRadius: "clamp(0.5rem, 2vw, 0.75rem)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      color: colors.text.primary,
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
    }, {
      padding: "0.75rem 1.25rem",
      fontSize: "0.9rem",
    }),
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
          style={styles.heading}
          variants={animations.heading}
        >
          Prepare Your Speech
        </motion.h1>

        <motion.div
          style={styles.timerContainer}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FiClock style={styles.clockIcon} />
          <motion.span 
            style={{
              ...styles.timer,
              color: timer <= 30 ? colors.accent.red : colors.text.primary
            }}
          >
            {formatTime(timer)}
          </motion.span>
        </motion.div>

        <motion.div
          style={styles.quoteContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.p style={styles.quoteText}>
            {quoteText}
          </motion.p>
        </motion.div>

        <motion.div
          style={styles.buttonContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            style={styles.button}
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft />
            Back
          </motion.button>
          <motion.button
            style={styles.button}
            onClick={() => navigate("/speech")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Speech
            <FiArrowRight />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PrepScreen;
