import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config"; // Import the base API URL

const ExtempScreen = () => {
  const [topics, setTopics] = useState([]); // Store two topics
  const [timer, setTimer] = useState(60); // 30 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);
  const navigate = useNavigate();

  // Fetching two random news topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/news?category=national,international`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.articles && data.articles.length > 0) {
          // Shuffle the articles and select two random ones
          const shuffledArticles = data.articles.sort(() => 0.5 - Math.random());
          const selectedTopics = shuffledArticles.slice(0, 2).map((article) => article.title);
          setTopics(selectedTopics);
        }
      } catch (error) {
        console.error("Error fetching news topics:", error);
      }
    };

    fetchTopics();
  }, []);

  // Timer countdown and redirection after timer ends
  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && topics.length > 0) {
      setIsTimerActive(false);
      // Automatically select the first topic if the timer runs out
      navigate("/extempPrep", { state: { topicName: topics[0] } });
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, topics, navigate]);

  const handleTopicSelect = (selectedTopic) => {
    navigate("/extempPrep", { state: { topicName: selectedTopic } }); // Manually start prep screen with selected topic
  };

  // Helper function to format the time as MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.timer}>Time Left: {formatTime(timer)}</div>
      <h1 style={styles.heading}>Choose a Topic</h1>
      {topics.length > 0 ? (
        <div style={styles.topicsContainer}>
          {topics.map((topic, index) => (
            <div
              key={index}
              style={styles.topicBox}
              onClick={() => handleTopicSelect(topic)}
            >
              {topic}
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.loadingText}>Loading topics...</p>
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
  topicsContainer: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    alignItems: "center",
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
    width: "300px",
  },
  loadingText: {
    fontSize: "1.4rem",
    fontWeight: "500",
    color: "#fff",
    marginTop: "20px",
  },
};

export default ExtempScreen;