import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import quotes from "../data/quotes";

function QuoteScreen() {
  const navigate = useNavigate();
  const [quotesList, setQuotesList] = useState([]);
  const [timer, setTimer] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const getRandomQuotes = () => {
    const randomQuotes = [];
    const shuffled = [...quotes].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3; i++) randomQuotes.push(shuffled[i]);
    setQuotesList(randomQuotes);
    setTimer(15);
    setIsTimerActive(true);
  };

  const handleQuoteSelect = (quote) => {
    navigate(`/prep/${quote}`, { state: { quoteText: quote } });
  };

  useEffect(() => {
    getRandomQuotes();
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      handleQuoteSelect(quotesList[Math.floor(Math.random() * quotesList.length)]);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, quotesList, handleQuoteSelect]);

  return (
    <div style={styles.container}>
      <div style={styles.timer}>Time Left: {timer}s</div>
      <h1 style={styles.heading}>Choose a Quote</h1>
      <ul style={styles.list}>
        {quotesList.map((quote, index) => (
          <li
            key={index}
            style={styles.listItem}
            onClick={() => handleQuoteSelect(quote)}
          >
            {quote}
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
  },
};

export default QuoteScreen;
