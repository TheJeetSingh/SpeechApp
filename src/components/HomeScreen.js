import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
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
        <h2 style={styles.modalTitle}>Feedback</h2>
        <p style={styles.modalText}>
          Is the problem really urgent and not a matter of your own input? If so, text me at{" "}
          <strong>6504800879</strong>.
        </p>
        <div style={styles.modalButtons}>
          <motion.button
            style={styles.modalButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
          >
            Continue
          </motion.button>
          <motion.button
            style={styles.modalButtonCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Header Component
function Header({ onFeedbackClick }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  // Check if the user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.name); // Set the user's name
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserName(""); // Clear the user's name
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div style={styles.header}>
      <h1 style={styles.headerTitle}>ARTICULATE</h1>
      <div style={styles.headerButtons}>
        {userName ? (
          <>
            <motion.button
              style={styles.nameButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {userName}
            </motion.button>
            <motion.button
              style={styles.logoutButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
            >
              Log Out
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              style={styles.signInButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
            >
              Sign In
            </motion.button>
            <motion.button
              style={styles.signUpButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </motion.button>
          </>
        )}
        <motion.button
          style={styles.feedbackButton}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFeedbackClick}
        >
          Give Feedback
        </motion.button>
      </div>
    </div>
  );
}

// HomeScreen Component
function HomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Get userName from JWT token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.name); // Store the name from decoded token
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  }, []);

  const handleNavigate = (type) => {
    if (type === "Impromptu") {
      navigate("/topics");
    } else if (type === "Extemp") {
      navigate("/beta");
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

  return (
    <div style={styles.container}>
      <Header onFeedbackClick={handleFeedbackClick} />
      <motion.h1
        style={styles.heading}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to Speech App{userName ? `, ${userName}` : ""} {/* Display "Welcome to Speech App" and userName if available */}
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
              style={styles.button}
              onClick={() => handleNavigate(type)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {type}
            </motion.button>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleClose} onConfirm={handleConfirm} />
    </div>
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
    paddingTop: "100px", // Adjust for header
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
    marginLeft: "-17px", // Moves both buttons to the left
  },
  headerTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
  },
  headerButtons: {
    display: "flex",
    gap: "20px",
    paddingLeft: "40px", // Keeps space between buttons as before
  },
  signInButton: {
    padding: "8px 16px",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "#00c853",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  signUpButton: {
    padding: "8px 16px",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "#00bcd4", // A different color to distinguish it from the sign-in button
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
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
  },
  nameButton: {
    padding: "8px 16px",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "#4CAF50", // Green background for the name button
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    marginRight: "20px", // Add spacing between the name and logout button
  },
  logoutButton: {
    padding: "8px 16px",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "#ff4d4d",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  heading: {
    fontSize: "3.5rem",
    fontWeight: "700",
    marginBottom: "20px",
    letterSpacing: "1px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column", // This makes the buttons stack vertically
    justifyContent: "center",
    gap: "20px", // Space between buttons
    marginBottom: "20px",
  },
  buttonWrapper: {
    display: "inline-block",
  },
  button: {
    width: "250px", // All buttons will have the same width
    height: "50px", // Fixed height for buttons
    fontSize: "1.2rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #d1d1d1, #ffffff)",
    color: "#333",
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
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(5px)", // Adds a blur effect to the background
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    background: "#fff",
    borderRadius: "12px",
    padding: "25px",
    width: "90%",
    maxWidth: "450px",
    textAlign: "center",
    boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    fontSize: "1.8rem",
    marginBottom: "15px",
    fontWeight: "bold",
    color: "#333",
  },
  modalText: {
    fontSize: "1rem",
    marginBottom: "25px",
    color: "#555",
    lineHeight: "1.5",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  modalButton: {
    padding: "12px 24px",
    fontSize: "1rem",
    backgroundColor: "#28a745",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s ease",
    fontWeight: "600",
  },
  modalButtonCancel: {
    padding: "12px 24px",
    fontSize: "1rem",
    backgroundColor: "#dc3545",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s ease",
    fontWeight: "600",
  },
};

export default HomeScreen;