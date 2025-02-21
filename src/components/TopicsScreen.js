import React from "react";
import { useNavigate } from "react-router-dom";

function TopicsScreen() {
  const navigate = useNavigate();

  const handleTopicSelect = (topicType) => {
    if (topicType === "quotes") {
      navigate("/quote");
    } else if (topicType === "concrete") {
      navigate("/concrete");
    } else if (topicType === "abstract") {
      navigate("/abstract");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Choose a Topic</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => handleTopicSelect("quotes")}>
          Quotes
        </button>
        <button style={styles.button} onClick={() => handleTopicSelect("concrete")}>
          Concrete
        </button>
        <button style={styles.button} onClick={() => handleTopicSelect("abstract")}>
          Abstract
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
    background: "linear-gradient(to bottom right, #6a1b9a, #ffeb3b)",
    color: "#fff",
    textAlign: "center",
    fontFamily: "Roboto, sans-serif",
    padding: "20px",
  },
  heading: {
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "40px",
    letterSpacing: "2px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  button: {
    padding: "16px 36px",
    fontSize: "1.2rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "30px",
    background: "#ffeb3b",
    color: "#6a1b9a",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
    width: "200px",
  },
};

export default TopicsScreen;