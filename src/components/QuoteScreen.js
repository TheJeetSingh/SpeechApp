import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
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
  }, [isTimerActive, timer, quotesList, handleQuoteSelect]);

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
        <motion.div style={componentStyles.timer} variants={animations.content}>
          Time Left: {timer}s
        </motion.div>
        <motion.h1
          style={componentStyles.heading}
          variants={animations.heading}
        >
          Choose a Quote
        </motion.h1>
        <motion.ul
          style={styles.list}
          variants={animations.content}
        >
          <AnimatePresence>
            {quotesList.map((quote, index) => (
              <motion.li
                key={index}
                style={styles.listItem}
                variants={animations.card}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleQuoteSelect(quote)}
                custom={index}
                layout
              >
                {quote}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}

const styles = {
  list: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
  },
  listItem: {
    ...componentStyles.card,
    fontSize: "1.2rem",
    padding: "20px 32px",
    background: `linear-gradient(135deg, ${colors.accent.red}, ${colors.accent.red}88)`,
    color: colors.text.primary,
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
    lineHeight: 1.6,
  },
};

export default QuoteScreen;
