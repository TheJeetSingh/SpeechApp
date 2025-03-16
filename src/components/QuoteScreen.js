import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { FiClock, FiMessageSquare, FiArrowRight } from "react-icons/fi";
import { isMobile } from "react-device-detect";
import quotes from "../data/quotes";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";

function QuoteScreen() {
  const navigate = useNavigate();
  const [quotesList, setQuotesList] = useState([]);
  const [timer, setTimer] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const getRandomQuotes = () => {
    const randomQuotes = [];
    const shuffled = [...quotes].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3; i++) randomQuotes.push(shuffled[i]);
    setQuotesList(randomQuotes);
    setTimer(15);
    setIsTimerActive(true);
  };

  const handleQuoteSelect = (quote) => {
    navigate(`/prep/${quote}`, { state: { quoteText: quote } });
  };

  useEffect(() => {
    getRandomQuotes();
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      handleQuoteSelect(quotesList[Math.floor(Math.random() * quotesList.length)]);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, quotesList]);

  const formatTime = (seconds) => {
    return seconds.toString().padStart(2, "0");
  };

  const getMobileStyles = (baseStyles, mobileStyles) => {
    return isMobile ? { ...baseStyles, ...mobileStyles } : baseStyles;
  };

  const styles = {
    heading: getMobileStyles({
      ...componentStyles.heading,
      fontSize: "clamp(1.5rem, 4vw, 2rem)",
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
      fontSize: "1.5rem",
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

    quotesContainer: getMobileStyles({
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

    quoteCard: getMobileStyles({
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
      padding: "clamp(1rem, 3vw, 2rem)",
      borderRadius: "clamp(0.75rem, 2vw, 1.25rem)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "clamp(0.75rem, 2vw, 1.5rem)",
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
      padding: "1rem",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "0.75rem",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    }),

    quoteIconContainer: getMobileStyles({
      color: colors.text.primary,
      background: "rgba(255, 255, 255, 0.15)",
      padding: "clamp(0.75rem, 2vw, 1rem)",
      borderRadius: "clamp(0.5rem, 2vw, 0.75rem)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      border: "1px solid rgba(255, 255, 255, 0.2)",
    }, {
      padding: "0.75rem",
      marginBottom: "0.5rem",
    }),

    quoteText: getMobileStyles({
      fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
      color: colors.text.primary,
      margin: 0,
      lineHeight: 1.6,
      flex: 1,
      wordBreak: "break-word",
    }, {
      fontSize: "0.9rem",
      lineHeight: 1.4,
    }),

    arrowContainer: getMobileStyles({
      color: colors.text.primary,
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "center",
      transition: "transform 0.3s ease",
    }, {
      marginTop: "0.75rem",
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
          Choose Your Quote
        </motion.h1>

        <motion.div
          style={styles.timerContainer}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FiClock size={24} style={styles.clockIcon} />
          <motion.span 
            style={{
              ...styles.timer,
              color: timer <= 5 ? colors.accent.red : colors.text.primary
            }}
          >
            {formatTime(timer)}s
          </motion.span>
        </motion.div>

        <motion.div style={styles.quotesContainer}>
          <AnimatePresence mode="wait">
            {quotesList.map((quote, index) => (
              <motion.div
                key={quote}
                style={styles.quoteCard}
                variants={animations.card}
                custom={index}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleQuoteSelect(quote)}
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
                  style={styles.quoteIconContainer}
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
                <motion.p style={styles.quoteText}>
                  {quote}
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
}

export default QuoteScreen;
