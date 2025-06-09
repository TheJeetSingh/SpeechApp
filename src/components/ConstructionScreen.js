import React from "react";
import { useNavigate } from "react-router-dom";

const UnderConstructionScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🚧 Oops! You Broke It. 🚧</h1>
      <p style={styles.text}>
        Why did you do that? While I fix YOUR 🫵 mess, enjoy this virtual construction zone! 🏗️👷‍♂️
      </p>
      <div style={styles.loader}></div>
      <p style={styles.smallText}>
        The Developer will be back once he walks his fish.
        Disclaimer: Your credit card will be automatically charged for breaking this site
      </p>
      <button style={styles.button} onClick={() => navigate("/home")}>Back to Home</button>
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
    background: "linear-gradient(to bottom right, #6a1b9a, #ffeb3b)",
    color: "#fff",
    textAlign: "center",
    fontFamily: "Roboto, sans-serif",
    padding: "20px",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "20px",
  },
  text: {
    fontSize: "1.2rem",
    maxWidth: "500px",
    marginBottom: "20px",
  },
  smallText: {
    fontSize: "1rem",
    fontStyle: "italic",
    opacity: 0.8,
    marginTop: "10px",
  },
  loader: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255, 255, 255, 0.3)",
    borderTop: "5px solid #fff",
    borderRadius: "50%",
    animation: "spin 3s linear infinite",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#6a1b9a",
    background: "#ffeb3b",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "0.3s ease",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
  },
};

export default UnderConstructionScreen;
