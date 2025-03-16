import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { FiClock, FiBox, FiArrowRight } from "react-icons/fi";
import concreteTopics from "../data/concrete";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";

function ConcreteScreen() {
  const navigate = useNavigate();
  const [topicsList, setTopicsList] = useState([]);
  const [timer, setTimer] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const getRandomConcreteTopics = () => {
    const randomTopics = [];
    const shuffled = [...concreteTopics].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3; i++) randomTopics.push(shuffled[i]);
    setTopicsList(randomTopics);
    setTimer(15);
    setIsTimerActive(true);
  };

  const handleConcreteSelect = (topic) => {
    navigate(`/prep/${topic}`, { state: { topicName: topic } });
  };

  useEffect(() => {
    getRandomConcreteTopics();
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      handleConcreteSelect(topicsList[Math.floor(Math.random() * topicsList.length)]);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, topicsList]);

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
          Choose Your Topic
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

        <motion.div style={styles.topicsContainer}>
          <AnimatePresence mode="wait">
            {topicsList.map((topic, index) => (
              <motion.div
                key={topic}
                style={styles.topicCard}
                variants={animations.card}
                custom={index}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleConcreteSelect(topic)}
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
                  style={styles.topicIconContainer}
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
                  <FiBox size={24} />
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
}

const styles = {
  heading: {
    ...componentStyles.heading,
    marginBottom: "2.5rem",
    background: `linear-gradient(45deg, ${colors.text.primary}, ${colors.accent.green})`,
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
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "1.5rem 2.5rem",
    borderRadius: "50px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    marginBottom: "3rem",
    width: "fit-content",
    margin: "0 auto 3rem auto",
  },
  clockIcon: {
    color: colors.text.primary,
  },
  timer: {
    fontSize: "1.8rem",
    fontWeight: "700",
    transition: "color 0.3s ease",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
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
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "2rem",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    transition: "all 0.3s ease",
  },
  topicIconContainer: {
    color: colors.text.primary,
    background: "rgba(255, 255, 255, 0.1)",
    padding: "1rem",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  topicText: {
    fontSize: "1.2rem",
    color: colors.text.primary,
    margin: 0,
    lineHeight: 1.6,
    flex: 1,
  },
  arrowContainer: {
    color: colors.text.primary,
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    transition: "transform 0.3s ease",
  },
};

export default ConcreteScreen;
