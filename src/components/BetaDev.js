import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
        <h2 style={styles.modalTitle}>Are You Sure?</h2>
        <p style={styles.modalText}>
          All jokes aside, Extemp is currently in beta. Proceed with caution!
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

const InBetaScreen = () => {
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
    <div style={styles.container}>
      <motion.h1
        style={styles.heading}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🎉 The Developer Has Fixed Extemp! 🎉
      </motion.h1>
      <p style={styles.text}>
        After ages of work, Extemp is finally up and running. Don't break it again! 🚧
      </p>
      <motion.button
        style={styles.button}
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Continue to Extemp
      </motion.button>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleContinue}
      />
    </div>
  );
};

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
    padding: "20px",
  },
  heading: {
    fontSize: "3.5rem",
    fontWeight: "700",
    marginBottom: "20px",
    letterSpacing: "1px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  },
  text: {
    fontSize: "1.2rem",
    maxWidth: "500px",
    marginBottom: "20px",
  },
  button: {
    marginTop: "20px",
    padding: "12px 24px",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#333",
    background: "linear-gradient(135deg, #d1d1d1, #ffffff)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
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
};

export default InBetaScreen;