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
    if (time < 30) return "Needs improvement";
    if (time >= 30 && time <= 60) return "Good";
    return "Excellent";
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Speech Stats</h1>
      <div style={styles.contentContainer}>
        <h2 style={styles.subHeading}>Your Speech Duration: {duration} seconds</h2>
        <h3 style={styles.rating}>Rating: {getRating(duration)}</h3>
      </div>
      <div style={styles.footer}>
        <button style={styles.goBackButton} onClick={handleGoBack}>
          Go Back to Home
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
    backgroundColor: "#f7f8f9",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontFamily: "Roboto, sans-serif",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  subHeading: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#34495e",
    marginBottom: "10px",
  },
  rating: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: "20px",
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "30px",
  },
  goBackButton: {
    fontSize: "1.3rem",
    padding: "12px 30px",
    borderRadius: "30px",
    backgroundColor: "#3498db",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease, transform 0.3s ease",
  },
};

export default SpeechStats;
