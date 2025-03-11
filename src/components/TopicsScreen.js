import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function TopicsScreen() {
  const navigate = useNavigate();
  const headingText = "Choose a Topic"; // The text that will be displayed

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
    <div style={styles.container}>
      <motion.h1
        style={styles.heading}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {headingText}
      </motion.h1>
      <div style={styles.buttonContainer}>
        {["quotes", "concrete", "abstract", "current"].map((topic) => (
          <motion.button
            key={topic}
            style={styles.button}
            onClick={() => handleTopicSelect(topic)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {topic.charAt(0).toUpperCase() + topic.slice(1).replace("current", "Current Events")}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)", // Same gradient as HomeScreen
    color: "#fff",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    paddingTop: "100px", // Adjust for header
  },
  heading: {
    fontSize: "3.5rem",
    fontWeight: "700",
    marginBottom: "40px",
    letterSpacing: "1px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", // Consistent shadow
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column", // Stack buttons vertically
    justifyContent: "center",
    gap: "20px", // Space between buttons
    marginBottom: "20px",
  },
  button: {
    width: "250px", // Same width as HomeScreen buttons
    height: "50px", // Same height as HomeScreen buttons
    fontSize: "1.2rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #d1d1d1, #ffffff)", // Same gradient as HomeScreen buttons
    color: "#333",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Consistent shadow
  },
};

export default TopicsScreen;