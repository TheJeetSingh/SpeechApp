import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { FiClock, FiMessageSquare, FiArrowRight } from "react-icons/fi";
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

const styles = {
  heading: {
    ...componentStyles.heading,
    marginBottom: "2.5rem",
    background: "linear-gradient(45deg, #FFFFFF, #9C27B0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto 2.5rem auto",
  },
  timerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    backgroundColor: "rgba(42, 82, 152, 0.95)",
    padding: "1.5rem 2.5rem",
    borderRadius: "50px",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.5)",
    marginBottom: "3rem",
    width: "fit-content",
    margin: "0 auto 3rem auto",
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
  quotesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    width: "90%",
    maxWidth: "800px",
    margin: "0 auto",
  },
  quoteCard: {
    backgroundColor: "rgba(42, 82, 152, 0.95)",
    padding: "2rem",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.5)",
    cursor: "pointer",
    display: "flex",
    alignItems: "flex-start",
    gap: "1.5rem",
    transition: "all 0.3s ease",
  },
  quoteIconContainer: {
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: "1rem",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  quoteText: {
    fontSize: "1.2rem",
    color: "#FFFFFF",
    margin: 0,
    lineHeight: 1.6,
    flex: 1,
  },
  arrowContainer: {
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    alignSelf: "center",
    transition: "transform 0.3s ease",
  },
};

export default QuoteScreen;
