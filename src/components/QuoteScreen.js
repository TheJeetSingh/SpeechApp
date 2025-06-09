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
          <AnimatePresence>
            {quotesList.map((quote, index) => (
              <motion.div
                key={quote}
                style={styles.quoteCard}
                variants={animations.card}
                custom={index}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleQuoteSelect(quote)}
                layout
              >
                <div style={styles.quoteIconContainer}>
                  <FiMessageSquare size={24} />
                </div>
                <p style={styles.quoteText}>
                  "{quote}"
                </p>
                <div style={styles.arrowContainer}>
                  <FiArrowRight size={20} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const styles = {
  content: {
    ...componentStyles.content,
    zIndex: 1
  },
  heading: {
    ...componentStyles.heading,
    marginBottom: "2rem",
    background: `linear-gradient(45deg, ${colors.accent.blue}, ${colors.accent.cyan})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },
  timerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    background: "rgba(10, 25, 47, 0.7)",
    padding: "1rem 2rem",
    borderRadius: "50px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
    marginBottom: "2.5rem",
    width: "fit-content",
    margin: "0 auto 2.5rem auto",
  },
  clockIcon: {
    color: colors.accent.cyan,
  },
  timer: {
    fontSize: "1.5rem",
    fontWeight: "700",
    transition: "color 0.3s ease",
    textShadow: `0 0 10px ${colors.accent.cyan}`,
  },
  quotesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
  },
  quoteCard: {
    background: "rgba(10, 25, 47, 0.7)",
    padding: "2rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 20px 0 rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    transition: "all 0.3s ease",
  },
  quoteIconContainer: {
    color: colors.text.primary,
    background: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.cyan})`,
    padding: "1rem",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  quoteText: {
    fontSize: "1.1rem",
    fontStyle: 'italic',
    color: colors.text.secondary,
    margin: 0,
    lineHeight: 1.6,
    flex: 1,
  },
  arrowContainer: {
    color: colors.text.secondary,
    transition: "transform 0.3s ease",
  },
};

export default QuoteScreen;
