import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { FiArrowRight, FiBook, FiMessageSquare, FiBox, FiGlobe } from "react-icons/fi";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";

const TopicsScreen = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Quotes",
      description: "Interpret and discuss meaningful quotes from various sources",
      icon: <FiMessageSquare size={24} />,
      path: "/quote",
      gradient: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.blue})`,
    },
    {
      title: "Abstract",
      description: "Explore philosophical and conceptual topics",
      icon: <FiBook size={24} />,
      path: "/abstract",
      gradient: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.green})`,
    },
    {
      title: "Concrete",
      description: "Discuss tangible, real-world subjects",
      icon: <FiBox size={24} />,
      path: "/concrete",
      gradient: `linear-gradient(135deg, ${colors.accent.green}, ${colors.accent.yellow})`,
    },
    {
      title: "Current Events",
      description: "Address contemporary issues and news",
      icon: <FiGlobe size={24} />,
      path: "/current",
      gradient: `linear-gradient(135deg, ${colors.accent.red}, ${colors.accent.purple})`,
    },
  ];

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
          Choose Your Topic Type
        </motion.h1>

        <motion.div style={styles.categoriesGrid}>
          <AnimatePresence>
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                style={{
                  ...styles.categoryCard,
                  background: category.gradient,
                }}
                variants={animations.card}
                custom={index}
                whileHover="hover"
                whileTap="tap"
                onClick={() => navigate(category.path)}
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
                  {category.icon}
                </motion.div>
                <div>
                  <motion.h2 style={styles.cardTitle}>
                    {category.title}
                  </motion.h2>
                  <motion.p style={styles.cardDescription}>
                    {category.description}
                  </motion.p>
                </div>
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

const styles = {
  heading: {
    ...componentStyles.heading,
    marginBottom: "2rem",
    background: `linear-gradient(45deg, ${colors.text.primary}, ${colors.accent.blue})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto 2rem auto",
  },
  categoriesGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    width: "90%",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "1rem",
  },
  categoryCard: {
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "1.5rem",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    transition: "all 0.3s ease",
  },
  iconContainer: {
    color: colors.text.primary,
    background: "rgba(255, 255, 255, 0.1)",
    padding: "0.75rem",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: colors.text.primary,
    margin: 0,
  },
  cardDescription: {
    fontSize: "0.9rem",
    color: colors.text.secondary,
    margin: "0.25rem 0 0 0",
    lineHeight: 1.4,
  },
  arrowContainer: {
    color: colors.text.primary,
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    transition: "transform 0.3s ease",
  },
};

export default TopicsScreen;