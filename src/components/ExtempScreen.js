import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { FiClock, FiMessageSquare, FiArrowRight } from "react-icons/fi";
import { isMobile } from "react-device-detect";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";

const ExtempScreen = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const getRandomTopics = () => {
    const allTopics = [
      "Should social media companies be regulated more strictly?",
      "Is universal basic income a viable solution to poverty?",
      "How can we address climate change effectively?",
      "Should college education be free?",
      "What role should AI play in healthcare?",
      "Is space exploration worth the investment?",
      "Should voting be mandatory?",
      "How can we improve global education systems?",
      "Should cryptocurrencies be regulated?",
      "Is nuclear energy the future of clean power?",
    ];

    const randomTopics = [];
    const shuffled = [...allTopics].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3; i++) randomTopics.push(shuffled[i]);
    setTopics(randomTopics);
    setTimer(30);
    setIsTimerActive(true);
  };

  const handleTopicSelect = (topic) => {
    navigate(`/extempPrep/${encodeURIComponent(topic)}`, { 
      state: { 
        topicName: topic,
        type: "Extemp"
      } 
    });
  };

  useEffect(() => {
    getRandomTopics();
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      handleTopicSelect(topics[Math.floor(Math.random() * topics.length)]);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, topics]);

  const formatTime = (seconds) => {
    return seconds.toString().padStart(2, "0");
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

    topicsContainer: getMobileStyles({
      display: "flex",
      flexDirection: "column",
      gap: "clamp(1rem, 3vw, 2rem)",
      width: "90%",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "0 1rem",
    }, {
      width: "95%",
      gap: "1rem",
      padding: "0 0.5rem",
    }),

    topicCard: getMobileStyles({
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
      padding: "clamp(1.5rem, 4vw, 2rem)",
      borderRadius: "clamp(1rem, 3vw, 1.5rem)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "clamp(1rem, 3vw, 1.5rem)",
      transition: "all 0.3s ease",
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
      padding: "1.25rem",
      gap: "1rem",
      borderRadius: "1rem",
      flexDirection: "column",
      alignItems: "flex-start",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    }),

    iconContainer: getMobileStyles({
      color: colors.text.primary,
      background: "rgba(255, 255, 255, 0.15)",
      padding: "clamp(0.75rem, 2vw, 1rem)",
      borderRadius: "clamp(0.75rem, 2vw, 1rem)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      border: "1px solid rgba(255, 255, 255, 0.2)",
    }, {
      padding: "0.75rem",
      borderRadius: "0.75rem",
    }),

    topicText: getMobileStyles({
      fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
      color: colors.text.primary,
      margin: 0,
      lineHeight: 1.6,
      flex: 1,
      wordBreak: "break-word",
    }, {
      fontSize: "1rem",
      lineHeight: 1.4,
    }),

    arrowContainer: getMobileStyles({
      color: colors.text.primary,
      display: "flex",
      alignItems: "center",
      marginLeft: "auto",
      transition: "transform 0.3s ease",
    }, {
      alignSelf: "flex-end",
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
          Choose Your Topic
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
              color: timer <= 10 ? colors.accent.red : colors.text.primary
            }}
          >
            {formatTime(timer)}s
          </motion.span>
        </motion.div>

        <motion.div style={styles.topicsContainer}>
          <AnimatePresence mode="wait">
            {topics.map((topic, index) => (
              <motion.div
                key={topic}
                style={styles.topicCard}
                variants={animations.card}
                custom={index}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleTopicSelect(topic)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.2 }
                }}
                exit={{ opacity: 0, y: -20 }}
                layout
              >
                <motion.div 
                  style={styles.iconContainer}
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                >
                  <FiMessageSquare size={24} />
                </motion.div>
                <motion.p style={styles.topicText}>
                  {topic}
                </motion.p>
                <motion.div
                  style={styles.arrowContainer}
                  whileHover={{ x: 5 }}
                >
                  <FiArrowRight size={20} />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ExtempScreen;
