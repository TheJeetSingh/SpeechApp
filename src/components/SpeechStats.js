import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SpeechStats() {
  const location = useLocation();
  const { duration } = location.state || {}; // Destructuring duration from state
  const navigate = useNavigate();

  // Function to navigate back to Topics Screen
  const handleGoBack = () => {
    navigate("/");
  };

  // Rating based on duration (simple example)
  const getRating = (time) => {
    if (time < 30) return "Needs Improvement";
    if (time >= 30 && time <= 60) return "Good";
    return "Excellent";
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Speech Statistics</h1>
      <div style={styles.contentContainer}>
        <h2 style={styles.subHeading}>Duration: {duration} seconds</h2>
        <h3 style={styles.rating}>Rating: {getRating(duration)}</h3>
      </div>
      <div style={styles.footer}>
        <button style={styles.goBackButton} onClick={handleGoBack}>
          Back to Home
        </button>
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
    background: "linear-gradient(135deg, #8E2DE2, #4A00E0)",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
    color: "#ffffff",
  },
  heading: {
    fontSize: "2.8rem",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "20px",
  },
  contentContainer: {
    background: "rgba(255, 255, 255, 0.15)",
    padding: "20px 40px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(8px)",
  },
  subHeading: {
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "10px",
  },
  rating: {
    fontSize: "1.5rem",
    fontWeight: "700",
    padding: "10px 20px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "10px",
    boxShadow: "0 3px 8px rgba(255, 255, 255, 0.2)",
    marginTop: "10px",
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "30px",
  },
  goBackButton: {
    fontSize: "1.3rem",
    padding: "14px 35px",
    borderRadius: "30px",
    background: "rgba(0, 255, 127, 0.8)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 6px 20px rgba(0, 255, 127, 0.4)",
    transition: "0.3s ease",
    backdropFilter: "blur(5px)",
  },
};

export default SpeechStats;
