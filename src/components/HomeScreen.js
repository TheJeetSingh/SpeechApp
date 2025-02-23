import React from "react";
import { useNavigate } from "react-router-dom";

function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Impromptu App</h1>
      <button style={styles.button} onClick={() => navigate("/topics")}>
        Impromptu
      </button>
      <button style={{ ...styles.button, marginTop: "20px" }} onClick={() => navigate("/speech")}>
        Interp
      </button>
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
    background: "linear-gradient(to bottom right, #6a1b9a, #ffeb3b)",
    color: "#fff",
    textAlign: "center",
    fontFamily: "Roboto, sans-serif",
  },
  heading: {
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "40px",
    letterSpacing: "2px",
  },
  button: {
    padding: "16px 36px",
    fontSize: "1.1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "30px",
    background: "#ffeb3b",
    color: "#6a1b9a",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
  },
};

export default HomeScreen;
