import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import concreteTopics from "../data/concrete"; // Correct import for concreteTopics

function ConcreteScreen() {
  const navigate = useNavigate();
  const [topicsList, setTopicsList] = useState([]);
  const [timer, setTimer] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const getRandomConcreteTopics = () => {
    const randomTopics = [];
    const shuffled = [...concreteTopics].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3; i++) randomTopics.push(shuffled[i]);
    setTopicsList(randomTopics);
    setTimer(15);
    setIsTimerActive(true);
  };

  const handleConcreteSelect = (topic) => {
    navigate(`/prep/${topic}`, { state: { topicName: topic } }); // Send topic name to PrepScreen
  };

  useEffect(() => {
    getRandomConcreteTopics();
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      handleConcreteSelect(topicsList[Math.floor(Math.random() * topicsList.length)]);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, topicsList, handleConcreteSelect]);

  return (
    <div style={styles.container}>
      <div style={styles.timer}>Time Left: {timer}s</div>
      <h1 style={styles.heading}>Choose a Concrete Topic</h1>
      <ul style={styles.list}>
        {topicsList.map((topic, index) => (
          <li
            key={index}
            style={styles.listItem}
            onClick={() => handleConcreteSelect(topic)}
          >
            {topic}
          </li>
        ))}
      </ul>
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
    background: "#ecf0f1",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontFamily: "Roboto, sans-serif",
  },
  timer: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#e74c3c",
    backgroundColor: "#fff",
    padding: "8px 16px",
    borderRadius: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: "30px",
    letterSpacing: "1px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  listItem: {
    fontSize: "1.2rem",
    padding: "16px 32px",
    borderRadius: "10px",
    backgroundColor: "#3498db",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.3s ease, background-color 0.3s ease",
  },
};

export default ConcreteScreen;
