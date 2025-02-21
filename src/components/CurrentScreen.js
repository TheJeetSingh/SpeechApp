import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const REACT_APP_API_KEY = process.env.REACT_APP_API_KEY
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&category=general&apiKey=${REACT_APP_API_KEY}`;

const CurrentScreen = () => {
  const [articles, setArticles] = useState([]);
  const [timer, setTimer] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(NEWS_API_URL);
        const data = await response.json();
        if (data.articles) {
          // Shuffle the articles and get 3 random ones
          const shuffledArticles = data.articles.sort(() => 0.5 - Math.random());
          setArticles(shuffledArticles.slice(0, 3)); // Limit to 3 random articles
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && articles.length > 0) {
      setIsTimerActive(false);
      const selectedArticle = articles[Math.floor(Math.random() * articles.length)].title;
      handleTopicSelect(selectedArticle);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, articles]);

  const handleTopicSelect = (title) => {
    // Navigate directly to /prep/${title} (making sure to encode the topic to avoid issues with spaces)
    navigate(`/prep/${encodeURIComponent(title)}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.timer}>Time Left: {timer}s</div>
      <h1 style={styles.heading}>Current Events Topics</h1>
      <ul style={styles.list}>
        {articles.map((article, index) => (
          <li key={index} style={styles.listItem} onClick={() => handleTopicSelect(article.title)}>
            {article.title}
          </li>
        ))}
      </ul>
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
    padding: "40px",
    textAlign: "center",
    fontFamily: "Roboto, sans-serif",
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#6a1b9a",
    cursor: "pointer",
    fontWeight: "600",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease, background-color 0.3s ease",
  },
};

export default CurrentScreen;
