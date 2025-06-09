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
      gradient: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.cyan})`,
    },
    {
      title: "Abstract",
      description: "Explore philosophical and conceptual topics",
      icon: <FiBook size={24} />,
      path: "/abstract",
      gradient: `linear-gradient(135deg, ${colors.accent.cyan}, ${colors.accent.green})`,
    },
    {
      title: "Concrete",
      description: "Discuss tangible, real-world subjects",
      icon: <FiBox size={24} />,
      path: "/concrete",
      gradient: `linear-gradient(135deg, ${colors.accent.green}, ${colors.accent.pink})`,
    },
    {
      title: "Current Events",
      description: "Address contemporary issues and news",
      icon: <FiGlobe size={24} />,
      path: "/current",
      gradient: `linear-gradient(135deg, ${colors.accent.red}, ${colors.accent.blue})`,
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
          Choose Your Topic Type
        </motion.h1>

        <motion.div style={styles.categoriesList}>
          <AnimatePresence>
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                style={{
                  ...styles.categoryCard,
                  borderImage: `${category.gradient} 1`,
                }}
                variants={animations.card}
                custom={index}
                whileHover="hover"
                whileTap="tap"
                onClick={() => navigate(category.path)}
                layout
              >
                <div style={{...styles.iconContainer, background: category.gradient }}>
                  {category.icon}
                </div>
                <div style={styles.cardContent}>
                  <h2 style={styles.cardTitle}>
                    {category.title}
                  </h2>
                  <p style={styles.cardDescription}>
                    {category.description}
                  </p>
                </div>
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
};

const styles = {
  content: {
    ...componentStyles.content,
    zIndex: 1,
  },
  heading: {
    ...componentStyles.heading,
    marginBottom: "2rem",
    background: `linear-gradient(45deg, ${colors.text.primary}, ${colors.secondary.main})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },
  categoriesList: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    width: "100%",
    maxWidth: "700px",
  },
  categoryCard: {
    background: "rgba(10, 25, 47, 0.7)",
    padding: "1.5rem",
    borderRadius: "15px",
    border: "2px solid transparent",
    backdropFilter: "blur(10px)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    transition: "all 0.3s ease",
  },
  iconContainer: {
    color: colors.text.primary,
    padding: "1rem",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: colors.text.primary,
    margin: 0,
    marginBottom: '0.25rem',
  },
  cardDescription: {
    fontSize: "0.95rem",
    color: colors.text.secondary,
    margin: 0,
    lineHeight: 1.5,
  },
  arrowContainer: {
    color: colors.text.secondary,
    transition: "transform 0.3s ease",
  },
};

export default TopicsScreen;