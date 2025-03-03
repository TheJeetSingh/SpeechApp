import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config"; // Import the base API URL

const ExtempScreen = () => {
  const [topic, setTopic] = useState(null);
  const [timer, setTimer] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const navigate = useNavigate();

  // Fetching a random news topic
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/news?category=national,international`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.articles && data.articles.length > 0) {
          // Shuffle the articles and select a random one
          const randomTopic = data.articles[Math.floor(Math.random() * data.articles.length)];
          
          if (randomTopic) {
            setTopic(randomTopic.title);
          }
        }
      } catch (error) {
        console.error("Error fetching news topic:", error);
      }
    };

    fetchTopic();
  }, []);

  // Timer countdown and redirection after timer ends
  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && topic) {
      setIsTimerActive(false);
      navigate("/extempPrep", { state: { topicName: topic } }); // Passing topic to ExtempPrepScreen
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, topic, navigate]);

  const handleTopicSelect = () => {
    navigate("/extempPrep", { state: { topicName: topic } }); // Manually start prep screen
  };

  return (
    <div style={styles.container}>
      <div style={styles.timer}>Time Left: {timer}s</div>
      <h1 style={styles.heading}>News Topic</h1>
      {topic ? (
        <div style={styles.topicBox} onClick={handleTopicSelect}>
          {topic}
        </div>
      ) : (
        <p style={styles.loadingText}>Loading topic...</p>
      )}
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
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    color: "#fff",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    padding: "40px",
  },
  timer: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: "8px 16px",
    borderRadius: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "30px",
    letterSpacing: "1px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  },
  topicBox: {
    fontSize: "1.2rem",
    padding: "16px 32px",
    borderRadius: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#333",
    cursor: "pointer",
    fontWeight: "600",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease, background-color 0.3s ease",
  },
  loadingText: {
    fontSize: "1.4rem",
    fontWeight: "500",
    color: "#fff",
    marginTop: "20px",
  },
};

export default ExtempScreen;
