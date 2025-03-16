import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { FiArrowRight, FiBook, FiMessageSquare, FiBox, FiGlobe } from "react-icons/fi";
import { isMobile } from "react-device-detect";
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

  const getMobileStyles = (baseStyles, mobileStyles) => {
    return isMobile ? { ...baseStyles, ...mobileStyles } : baseStyles;
  };

  const styles = {
    heading: getMobileStyles({
      ...componentStyles.heading,
      fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
      marginBottom: "clamp(1.5rem, 4vw, 2.5rem)",
      background: `linear-gradient(45deg, ${colors.text.primary}, ${colors.accent.blue})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textAlign: "center",
      width: "100%",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "0 1rem",
    }, {
      fontSize: "1.8rem",
      marginBottom: "1.5rem",
    }),

    categoriesGrid: getMobileStyles({
      display: "flex",
      flexDirection: "column",
      gap: "clamp(1rem, 3vw, 1.5rem)",
      width: "90%",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "1rem",
    }, {
      gap: "1rem",
      padding: "0.5rem",
      width: "95%",
    }),

    categoryCard: getMobileStyles({
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
      padding: "clamp(1.5rem, 4vw, 2rem)",
      borderRadius: "clamp(1rem, 3vw, 1.5rem)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      transition: "all 0.3s ease",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    }, {
      padding: "1.25rem",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    }),

    iconContainer: getMobileStyles({
      color: colors.text.primary,
      background: "rgba(255, 255, 255, 0.15)",
      padding: "clamp(0.75rem, 2vw, 1rem)",
      borderRadius: "clamp(0.75rem, 2vw, 1rem)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    }, {
      padding: "0.75rem",
      borderRadius: "0.75rem",
      flexShrink: 0,
    }),

    textContainer: getMobileStyles({
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      flex: 1,
    }, {
      gap: "0.25rem",
    }),

    cardTitle: getMobileStyles({
      fontSize: "clamp(1.1rem, 3vw, 1.25rem)",
      fontWeight: "600",
      color: colors.text.primary,
      margin: 0,
    }, {
      fontSize: "1.1rem",
    }),

    cardDescription: getMobileStyles({
      fontSize: "clamp(0.85rem, 2.5vw, 0.9rem)",
      color: colors.text.secondary,
      margin: 0,
      lineHeight: 1.4,
      flex: 1,
    }, {
      fontSize: "0.85rem",
      display: isMobile ? "none" : "block", // Hide description on mobile
    }),

    arrowContainer: getMobileStyles({
      color: colors.text.primary,
      display: "flex",
      alignItems: "center",
      marginTop: "0.75rem",
      transition: "transform 0.3s ease",
    }, {
      marginTop: 0,
      marginLeft: "auto",
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
              value: 30, // Reduce particles on mobile
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
                <div style={styles.textContainer}>
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

export default TopicsScreen;