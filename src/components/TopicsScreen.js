import React from "react";
import { useNavigate } from "react-router-dom";

function TopicsScreen() {
  const navigate = useNavigate();

  const handleTopicSelect = (topicType) => {
    if (topicType === "quotes") {
      navigate("/quote");
    } else if (topicType === "concrete") {
      navigate("/concrete");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Choose a Topic</h1>
      <button style={styles.button} onClick={() => handleTopicSelect("quotes")}>
        Quotes
      </button>
      <button style={styles.button} onClick={() => handleTopicSelect("concrete")}>
        Concrete Topics
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
    backgroundColor: "#ecf0f1",
    padding: "40px 20px",
    borderRadius: "20px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontFamily: "Roboto, Arial, sans-serif",
    maxWidth: "900px",
    margin: "auto",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#2c3e50",
    marginBottom: "25px",
    letterSpacing: "1.5px",
  },
  subHeading: {
    fontSize: "1.5rem",
    color: "#7f8c8d",
    marginBottom: "40px",
    fontWeight: "500",
    lineHeight: "1.5",
  },
  topicsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "25px",
    width: "100%",
    marginBottom: "40px",
  },
  topicCard: {
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    transition: "transform 0.3s ease, background-color 0.3s ease",
    textAlign: "center",
    fontWeight: "700",
    fontSize: "1.4rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  topicCardHovered: {
    transform: "scale(1.05)",
    backgroundColor: "#2980b9",
  },
  topicName: {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#fff",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  footer: {
    marginTop: "35px",
  },
  button: {
    fontSize: "1.4rem",
    padding: "14px 35px",
    borderRadius: "50px",
    backgroundColor: "#3498db",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease, transform 0.3s ease",
    outline: "none",
    width: "auto",
    margin: "10px",
  },
  buttonHover: {
    backgroundColor: "#2980b9",
    transform: "scale(1.05)",
  },
};

export default TopicsScreen;
