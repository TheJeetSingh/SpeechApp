import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";
import { FiArrowRight } from "react-icons/fi";

function TopicsScreen() {
  const navigate = useNavigate();
  const headingText = "Choose a Topic";

  const topics = [
    {
      type: "quotes",
      title: "Quotes",
      description: "Practice with famous quotes and sayings",
      gradient: `linear-gradient(135deg, ${colors.accent.red}, ${colors.accent.red}88)`,
      icon: "💭"
    },
    {
      type: "concrete",
      title: "Concrete",
      description: "Speak about tangible objects",
      gradient: `linear-gradient(135deg, ${colors.accent.green}, ${colors.accent.green}88)`,
      icon: "🎯"
    },
    {
      type: "abstract",
      title: "Abstract",
      description: "Explore topics that aren't physically graspable",
      gradient: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.blue}88)`,
      icon: "🌌"
    },
    {
      type: "current",
      title: "Current Events",
      description: "Discuss the most recent news",
      gradient: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.purple}88)`,
      icon: "📰"
    }
  ];

  const handleTopicSelect = (topicType) => {
    switch (topicType) {
      case "quotes":
        navigate("/quote");
        break;
      case "concrete":
        navigate("/concrete");
        break;
      case "abstract":
        navigate("/abstract");
        break;
      case "current":
        navigate("/current");
        break;
      default:
        break;
    }
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
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {headingText}
        </motion.h1>

        <motion.div
          style={styles.topicsContainer}
          variants={animations.content}
        >
          <AnimatePresence>
            {topics.map((topic, index) => (
              <motion.div
                key={topic.type}
                style={{
                  ...styles.topicCard,
                  background: topic.gradient
                }}
                variants={animations.card}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleTopicSelect(topic.type)}
                custom={index}
                layout
              >
                <motion.div
                  style={styles.topicIcon}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {topic.icon}
                </motion.div>
                <motion.h2 
                  style={styles.topicTitle}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {topic.title}
                </motion.h2>
                <motion.p 
                  style={styles.topicDescription}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {topic.description}
                </motion.p>
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
    marginBottom: "2rem",
    background: `linear-gradient(45deg, ${colors.text.primary}, ${colors.secondary.main})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },
  topicsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "clamp(1rem, 3vw, 2rem)",
    width: "100%",
    padding: "clamp(0.5rem, 2vw, 1rem)",
  },
  topicCard: {
    background: colors.background.glass,
    padding: "2rem",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "all 0.3s ease",
  },
  topicIcon: {
    fontSize: "clamp(2rem, 6vw, 3rem)",
    marginBottom: "1rem",
    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
  },
  topicTitle: {
    fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
    fontWeight: "600",
    marginBottom: "0.5rem",
    color: colors.text.primary,
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
  },
  topicDescription: {
    fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
    opacity: 0.9,
    lineHeight: 1.4,
    maxWidth: "280px",
    margin: "0 auto",
    color: colors.text.primary,
  },
  "@media (max-width: 768px)": {
    topicsContainer: {
      gridTemplateColumns: "1fr",
    }
  }
};

export default TopicsScreen;