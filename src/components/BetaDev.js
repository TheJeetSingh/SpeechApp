import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { FiArrowRight, FiAlertTriangle } from "react-icons/fi";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";

// Modal Component
function Modal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        style={styles.modalOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          style={styles.modalContent}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <motion.div
            style={styles.modalIcon}
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FiAlertTriangle size={48} color={colors.accent.red} />
          </motion.div>
          <motion.h2 
            style={styles.modalTitle}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Are You Sure?
          </motion.h2>
          <motion.p 
            style={styles.modalText}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            All jokes aside, Extemp is currently in beta. Proceed with caution!
          </motion.p>
          <motion.div 
            style={styles.modalButtons}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              style={styles.modalButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
            >
              I'm Brave Enough
            </motion.button>
            <motion.button
              style={styles.modalButtonCancel}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
            >
              Maybe Later
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const BetaScreen = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContinue = () => {
    setIsModalOpen(false);
    navigate("/extemp");
  };

  const handleClose = () => {
    setIsModalOpen(false);
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
        <motion.div
          style={styles.celebrationEmoji}
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🎉
        </motion.div>
        
        <motion.h1
          style={styles.heading}
          variants={animations.heading}
        >
          Extemp is Ready!
        </motion.h1>

        <motion.div
          style={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p style={styles.text}>
            After countless hours of development and testing, Extemp is finally up and running. 
            Get ready to tackle current events and global issues! 🌍
          </p>
          <motion.div 
            style={styles.features}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div style={styles.feature}>✨ Real-time news topics</div>
            <div style={styles.feature}>⚡️ Smart topic filtering</div>
            <div style={styles.feature}>🎯 Focused preparation</div>
          </motion.div>
        </motion.div>

        <motion.button
          style={styles.button}
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span>Start Your Journey</span>
          <FiArrowRight style={styles.buttonIcon} />
        </motion.button>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleContinue}
      />
    </motion.div>
  );
};

const styles = {
  celebrationEmoji: {
    fontSize: "4rem",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  heading: {
    ...componentStyles.heading,
    background: `linear-gradient(45deg, ${colors.text.primary}, ${colors.accent.blue})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "2.5rem",
    textAlign: "center",
    width: "100%",
  },
  card: {
    background: colors.background.glass,
    padding: "2.5rem",
    borderRadius: "20px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    maxWidth: "600px",
    width: "90%",
    marginBottom: "2.5rem",
    margin: "0 auto 2.5rem auto",
  },
  text: {
    fontSize: "1.2rem",
    lineHeight: 1.6,
    color: colors.text.primary,
    marginBottom: "2rem",
    textAlign: "center",
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "center",
    width: "100%",
  },
  feature: {
    fontSize: "1.1rem",
    color: colors.text.primary,
    padding: "1rem 2rem",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    backdropFilter: "blur(5px)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.8rem",
    padding: "1.2rem 2.5rem",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: colors.text.primary,
    background: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.purple})`,
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    margin: "0 auto",
  },
  buttonIcon: {
    fontSize: "1.4rem",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: colors.background.card,
    padding: "2rem",
    borderRadius: "20px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center",
  },
  modalIcon: {
    marginBottom: "1rem",
  },
  modalTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: colors.text.dark,
    background: `linear-gradient(45deg, ${colors.accent.red}, ${colors.accent.purple})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  modalText: {
    fontSize: "1.1rem",
    color: colors.text.dark,
    marginBottom: "1.5rem",
    lineHeight: 1.6,
  },
  modalButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  modalButton: {
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "50px",
    background: `linear-gradient(135deg, ${colors.accent.red}, ${colors.accent.purple})`,
    color: colors.text.primary,
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  },
  modalButtonCancel: {
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "50px",
    background: colors.background.glass,
    color: colors.text.dark,
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
};

export default BetaScreen;