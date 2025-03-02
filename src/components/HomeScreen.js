import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { FaRocket } from 'react-icons/fa'; // Icon example
import { gsap } from 'gsap'; // GSAP for more advanced animations
import "react-tooltip/dist/react-tooltip.css";

// Modal Component
function Modal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <motion.div
      style={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={styles.modalContent}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <h2 style={styles.modalTitle}>Feedback</h2>
        <p style={styles.modalText}>
          Is the problem really urgent and not a matter of your own input? If so, text me at 650-480-0879.
        </p>
        <div style={styles.modalButtons}>
          <button style={styles.modalButton} onClick={onConfirm}>
            Continue
          </button>
          <button style={styles.modalButtonCancel} onClick={onClose}>
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Header Component
function Header({ onFeedbackClick }) {
  return (
    <div style={styles.header}>
      <h1 style={styles.headerTitle}>ARTICULATE</h1>
      <motion.button
        style={styles.feedbackButton}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onFeedbackClick}
      >
        Give Feedback
      </motion.button>
    </div>
  );
}

// HomeScreen Component
function HomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (type) => {
    if (type === "Impromptu") {
      navigate("/topics");
    } else if (type === "Extemp") {
      navigate("/construction");
    } else {
      navigate("/speech", { state: { type } });
    }
  };

  const handleFeedbackClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSe4OOpOy9YXIis2tJIfMBpcQ6yIQQetQ9gm91YgdCt6dbpzbw/viewform?usp=dialog"; // Redirect to the Google Form
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  // Color change effect with GSAP
  useEffect(() => {
    const colorTimeline = gsap.timeline({ repeat: -1, yoyo: true });

    colorTimeline.to(".color-change", {
      color: "#FF6347", // Tomato color
      duration: 2,
      ease: "power1.inOut",
    });

    colorTimeline.to(".color-change", {
      color: "#32CD32", // Lime green
      duration: 2,
      ease: "power1.inOut",
    });

    colorTimeline.to(".color-change", {
      color: "#1E90FF", // Dodger blue
      duration: 2,
      ease: "power1.inOut",
    });

  }, []);

  return (
    <div style={styles.container}>
      <Header onFeedbackClick={handleFeedbackClick} />
      <motion.h1
        className="color-change"
        style={styles.heading}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to Speech App
      </motion.h1>
      <div style={styles.buttonContainer}>
        {[
          { type: "Impromptu", desc: "Quick thinking, spontaneous speeches. 2 minutes" },
          { type: "Interp", desc: "Perform your own interpretation of a piece." },
          { type: "Original", desc: "Craft and present original content." },
          { type: "Extemp", desc: "Speak on current events with depth." },
        ].map(({ type, desc }) => (
          <div key={type} style={styles.buttonWrapper}>
            <motion.button
              data-tooltip-id={type}
              data-tooltip-content={desc}
              style={styles.button}
              onClick={() => handleNavigate(type)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1 }}
            >
              <FaRocket /> {type}
            </motion.button>
            <Tooltip id={type} place="top" effect="solid" style={styles.tooltip} />
          </div>
        ))}
      </div>
      <Footer />
      <Modal isOpen={isModalOpen} onClose={handleClose} onConfirm={handleConfirm} />
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <footer style={styles.footer}>
      <a
        href="https://github.com/TheJeetSingh/SpeechApp/tree/master"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.githubButton}
      >
        Check out the code on GitHub
      </a>
    </footer>
  );
}

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    color: "#fff",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#1e3c72",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 4000,
  },
  headerTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
  },
  feedbackButton: {
    padding: "8px 16px",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "#C70039",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    marginRight: "20px",
  },
  heading: {
    fontSize: "3.5rem",
    fontWeight: "700",
    marginBottom: "20px",
    letterSpacing: "1px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    marginTop: "100px",
  },
  buttonContainer: {
    display: "flex", // Use flexbox for a row layout
    justifyContent: "center", // Center the buttons
    gap: "20px", // Add space between buttons
    marginBottom: "20px",
  },
  buttonWrapper: {
    display: "inline-block", // Keep the buttons in the same row
  },
  
  button: {
    padding: "12px 24px",
    fontSize: "1.2rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #d1d1d1, #ffffff)", // Light gray to white gradient
    color: "#333", // Dark text color for professionalism
    cursor: "pointer",
    transition: "all 0.3s ease", // Smooth transition
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
  },   
  
  tooltip: {
    fontSize: "0.9rem",
    padding: "8px 12px",
    borderRadius: "6px",
    background: "#333",
    color: "#fff",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#333",
  },
  modalText: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "20px",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  modalButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "#C70039",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  modalButtonCancel: {
    padding: "10px 20px",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "#ccc",
    color: "#333",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: "10px 0",
    background: "#1e3c72",
    textAlign: "center",
    boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.2)",
  },
  githubButton: {
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: "600",
    background: "#00c853", // Green button background color
    color: "#fff",
    textDecoration: "none",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
};

export default HomeScreen;
