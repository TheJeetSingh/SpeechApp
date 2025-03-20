import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import abstractTopics from "../data/abstract";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";

function AbstractScreen() {
  const navigate = useNavigate();
  const [topicsList, setTopicsList] = useState([]);
  const [timer, setTimer] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const getRandomAbstractTopics = () => {
    const randomTopics = [];
    const shuffled = [...abstractTopics].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3; i++) randomTopics.push(shuffled[i]);
    setTopicsList(randomTopics);
    setTimer(15);
    setIsTimerActive(true);
  };

  const handleAbstractSelect = (topic) => {
    navigate(`/prep/${topic}`, { state: { topicName: topic } });
  };

  useEffect(() => {
    getRandomAbstractTopics();
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      handleAbstractSelect(topicsList[Math.floor(Math.random() * topicsList.length)]);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, topicsList, handleAbstractSelect]);

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
        <motion.div style={componentStyles.timerContainer} variants={animations.content}>
          <motion.div style={componentStyles.clockIcon} variants={animations.content}>
            {/* Clock icon SVG */}
          </motion.div>
          <motion.div style={componentStyles.timer} variants={animations.content}>
            Time Left: {timer}s
          </motion.div>
        </motion.div>
        <motion.h1
          style={componentStyles.heading}
          variants={animations.heading}
        >
          Choose an Abstract Topic
        </motion.h1>
        <motion.div style={componentStyles.topicsContainer} variants={animations.content}>
          <AnimatePresence>
            {topicsList.map((topic, index) => (
              <motion.div
                key={index}
                style={componentStyles.topicCard}
                variants={animations.card}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleAbstractSelect(topic)}
                custom={index}
                layout
              >
                <motion.div style={componentStyles.topicIconContainer} variants={animations.content}>
                  {/* Topic icon SVG */}
                </motion.div>
                <motion.div style={componentStyles.topicText} variants={animations.content}>
                  {topic}
                </motion.div>
                <motion.div style={componentStyles.arrowContainer} variants={animations.content}>
                  {/* Arrow SVG */}
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
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    transition: "all 0.3s ease",
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
  topicText: {
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
    transition: "transform 0.3s ease",
  },
};

export default AbstractScreen;
