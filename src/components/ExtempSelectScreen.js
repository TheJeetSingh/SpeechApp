import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";

const ExtempSelectScreen = () => {
  const navigate = useNavigate();
  const [hoveredOption, setHoveredOption] = useState(null);

  const handleSelect = (type) => {
    navigate("/extempTopicSelect", { state: { extempType: type } });
  };

  return (
    <motion.div
      style={componentStyles.container}
      variants={animations.container}
      initial="hidden"
      animate="visible"
    >
      <Particles id="tsparticles" options={particlesConfig} />
      <motion.div style={componentStyles.content} variants={animations.content}>
        <motion.h1 style={componentStyles.heading} variants={animations.heading}>
          Select Extemp Category
        </motion.h1>

        <motion.div style={styles.optionsContainer} variants={animations.content}>
          <motion.div
            style={{
              ...styles.optionCard,
              ...(hoveredOption === "NX" ? styles.optionCardHovered : {}),
              background: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.blue}88)`,
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect("NX")}
            onHoverStart={() => setHoveredOption("NX")}
            onHoverEnd={() => setHoveredOption(null)}
          >
            <motion.h2 style={styles.optionTitle}>National Extemp (NX)</motion.h2>
            <motion.div style={styles.optionIcon}>🇺🇸</motion.div>
            <motion.p style={styles.optionDescription}>
              Focus on U.S. domestic issues, American politics, economic policies, and social trends within the United States.
            </motion.p>
          </motion.div>

          <motion.div
            style={{
              ...styles.optionCard,
              ...(hoveredOption === "IX" ? styles.optionCardHovered : {}),
              background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.purple}88)`,
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect("IX")}
            onHoverStart={() => setHoveredOption("IX")}
            onHoverEnd={() => setHoveredOption(null)}
          >
            <motion.h2 style={styles.optionTitle}>International Extemp (IX)</motion.h2>
            <motion.div style={styles.optionIcon}>🌎</motion.div>
            <motion.p style={styles.optionDescription}>
              Focus on international relations, global politics, foreign affairs, and worldwide economic and social issues.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  optionsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "30px",
    width: "100%",
    maxWidth: "1000px",
    margin: "20px auto",
    flexWrap: "wrap",
  },
  optionCard: {
    padding: "30px",
    borderRadius: "15px",
    color: colors.text.primary,
    width: "400px",
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
  },
  optionCardHovered: {
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  optionTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "15px",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
  },
  optionIcon: {
    fontSize: "4rem",
    margin: "15px 0",
  },
  optionDescription: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    opacity: "0.9",
  },
};

export default ExtempSelectScreen; 