import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config"; // Import the base API URL

const CurrentScreen = () => {
  const [articles, setArticles] = useState([]);
  const [timer, setTimer] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/news`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.articles?.length) {
          setArticles(getRandomArticles(data.articles, 3));
        } else {
          setError("No articles found. Please try again later.");
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch news articles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const getRandomArticles = (articles, count) => {
    if (articles.length <= count) return articles;
    const selectedIndexes = new Set();
    while (selectedIndexes.size < count) {
      selectedIndexes.add(Math.floor(Math.random() * articles.length));
    }
    return Array.from(selectedIndexes).map((index) => articles[index]);
  };

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && articles.length) {
      setIsTimerActive(false);
      navigate(`/prep/${encodeURIComponent(articles[0].title)}`, {
        state: { topicName: articles[0].title },
      });
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, articles, navigate]);

  return (
    <div style={styles.container}>
      {isLoading && <div style={styles.loading}>Loading...</div>}
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.timer}>Time Left: {timer}s</div>
      <h1 style={styles.heading}>Current Events</h1>
      <ul style={styles.list}>
        {articles.map((article, index) => (
          <li
            key={index}
            style={styles.listItem}
            onClick={() =>
              navigate(`/prep/${encodeURIComponent(article.title)}`, {
                state: { topicName: article.title },
              })
            }
          >
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
    color: "#333",
    cursor: "pointer",
    fontWeight: "600",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease, background-color 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
  },
  error: {
    color: "#ff6b6b",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
    textAlign: "center",
  },
  loading: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#fff",
  },
};

export default CurrentScreen;