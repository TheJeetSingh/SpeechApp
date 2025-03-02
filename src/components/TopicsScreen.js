import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TopicsScreen() {
  const navigate = useNavigate();
  const [text, setText] = useState(""); // State for typing effect
  const [isDeleting, setIsDeleting] = useState(false); // Track if it's deleting
  const [loopIndex, setLoopIndex] = useState(0); // Keep track of the typing loops
  const headingText = "Choose a Topic"; // The text that will be typed

  useEffect(() => {
    let index = 0;
    const typingSpeed = 150; // Speed of typing effect
    const deletingSpeed = 80; // Speed of deleting effect
    const loopInterval = 2000; // Time before resetting the typing effect

    const typeWriterEffect = setInterval(() => {
      if (isDeleting) {
        if (index > 0) {
          setText((prev) => prev.slice(0, prev.length - 1)); // Delete one character
          index--;
        } else {
          setIsDeleting(false);
          setLoopIndex((prev) => prev + 1); // Increment loop counter to restart typing after delete
        }
      } else {
        if (index < headingText.length) {
          setText((prev) => prev + headingText.charAt(index)); // Type one character
          index++;
        } else {
          setIsDeleting(true); // Start deleting after text is typed out
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed); // Adjust speed depending on whether we're typing or deleting

    return () => clearInterval(typeWriterEffect);
  }, [isDeleting, loopIndex]);

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
      <h1 style={styles.heading}>{text}</h1>
      <div style={styles.buttonContainer}>
        {["quotes", "concrete", "abstract", "current"].map((topic) => (
          <button
            key={topic}
            style={styles.button}
            onClick={() => handleTopicSelect(topic)}
            onMouseOver={(e) => e.target.classList.add("hover")}
            onMouseOut={(e) => e.target.classList.remove("hover")}
          >
            {topic.charAt(0).toUpperCase() + topic.slice(1).replace("current", "Current Events")}
          </button>
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
    height: "100vh",
    background: "linear-gradient(135deg, #003366, #1a3a5c)", // Deep dark blue gradient
    color: "#fff",
    textAlign: "center",
    fontFamily: "Roboto, sans-serif",
    margin: "0",
    padding: "0",
    overflow: "hidden",
    position: "relative",
    animation: "backgroundMove 15s infinite linear", // Slow-moving gradient
  },
  heading: {
    fontSize: "4.5rem",
    fontWeight: "bold",
    marginBottom: "80px",
    letterSpacing: "4px",
    textTransform: "uppercase",
    textShadow: "3px 3px 8px rgba(0, 0, 0, 0.4)", // 3D shadow effect
    color: "#ffffff",
    animation: "headingEffect 1s ease-in-out infinite, glowEffect 1.5s alternate infinite", // Heading 3D pop effect and glow
    position: "relative",
  },
  buttonContainer: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
    width: "100%",
    maxWidth: "400px",
  },
  button: {
    padding: "18px 45px",
    fontSize: "1.5rem",
    fontWeight: "700",
    border: "none",
    borderRadius: "35px",
    background: "#4b5c6b", // Dark greyish blue
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.2)",
    textTransform: "uppercase",
    outline: "none",
    transition: "all 0.3s ease-in-out",
    position: "relative",
    zIndex: 1,
  },
  hover: {
    transform: "translateY(-5px)", // Button lifts up on hover
    boxShadow: "0px 20px 25px rgba(0, 0, 0, 0.3)", // Stronger shadow on hover
    background: "#5a6b80", // Slightly lighter greyish blue
  },
};

// 3D pop effect for the heading
const headingEffect = `@keyframes headingEffect {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}`;

// Smooth moving background gradient
const backgroundMove = `@keyframes backgroundMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`;

// Glow effect for heading
const glowEffect = `@keyframes glowEffect {
  0% { text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.4), 0 0 25px rgba(0, 128, 255, 0.5); }
  50% { text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.4), 0 0 50px rgba(0, 128, 255, 0.7); }
  100% { text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.4), 0 0 25px rgba(0, 128, 255, 0.5); }
}`;

export default TopicsScreen;
