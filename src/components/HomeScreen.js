import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomeScreen() {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmitFeedback = () => {
    // Redirect to the Google Form
    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSe4OOpOy9YXIis2tJIfMBpcQ6yIQQetQ9gm91YgdCt6dbpzbw/viewform";
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Speech App</h1>
      <button style={styles.button} onClick={() => navigate("/topics")}>
        Impromptu
      </button>
      <button style={{ ...styles.button, marginTop: "20px" }} onClick={() => navigate("/speech")}>
        Interp
      </button>
      <button style={{ ...styles.button, marginTop: "20px" }} onClick={() => navigate("/speech")}>
        Original
      </button>
      <button style={{ ...styles.button, marginTop: "20px" }} onClick={() => navigate("/construction")}>
        Extemp
      </button>

      {/* Small button in the top-right corner */}
      <button
        style={{
          ...styles.button,
          position: "absolute",
          top: "20px",
          right: "20px",
          fontSize: "0.8rem", // Smaller button
          padding: "8px 16px", // Smaller padding
          background: "#ff5722",
        }}
        onClick={handleSubmitFeedback}
      >
        Give Feedback
      </button>

      {showFeedback && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalHeading}>Feedback</h2>
            <textarea 
              style={styles.textarea} 
              value={feedback} 
              onChange={(e) => setFeedback(e.target.value)} 
              placeholder="Share your thoughts..."
            ></textarea>
            <button style={styles.submitButton} onClick={handleSubmitFeedback}>Submit</button>
            <button style={styles.closeButton} onClick={() => setShowFeedback(false)}>Close</button>
          </div>
        </div>
      )}
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
    position: "relative", // Needed for absolute positioning of the button
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
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    color: "#000",
    width: "300px",
  },
  modalHeading: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    resize: "none",
    marginBottom: "10px",
  },
  submitButton: {
    padding: "10px 20px",
    background: "#6a1b9a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  closeButton: {
    padding: "10px 20px",
    background: "#ccc",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default HomeScreen;
