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
        <motion.div style={componentStyles.timer} variants={animations.content}>
          Time Left: {timer}s
        </motion.div>
        <motion.h1
          style={componentStyles.heading}
          variants={animations.heading}
        >
          Choose an Abstract Topic
        </motion.h1>
        <motion.ul
          style={styles.list}
          variants={animations.content}
        >
          <AnimatePresence>
            {topicsList.map((topic, index) => (
              <motion.li
                key={index}
                style={styles.listItem}
                variants={animations.card}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleAbstractSelect(topic)}
                custom={index}
                layout
              >
                {topic}
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
    maxWidth: "600px",
    margin: "0 auto",
  },
  listItem: {
    ...componentStyles.card,
    fontSize: "1.2rem",
    padding: "16px 32px",
    background: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.blue}88)`,
    color: colors.text.primary,
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
  },
};

export default AbstractScreen;
