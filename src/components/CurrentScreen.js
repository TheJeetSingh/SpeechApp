import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { FiClock, FiLoader, FiAlertTriangle, FiArrowRight } from "react-icons/fi";
import config from "../config";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";

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
        // Use the server endpoint for NYT API
        const apiUrl = `${config.API_URL}${config.NYT_NEWS_ENDPOINT}`;
          
        const response = await fetch(apiUrl);

        if (!response.ok) {
          setError("Unable to fetch current topics. Please try again later.");
          return;
        }

        const data = await response.json();

        if (data?.results?.length) {
          const processedArticles = data.results.map(article => ({
            title: article.title || '',
            description: article.abstract || '',
            section: article.section || 'general',
            url: article.url || ''
          })).filter(article => article.title && article.description);
          setArticles(getRandomArticles(processedArticles, 3));
        } else {
          setError("No topics available at the moment. Please try again later.");
        }
      } catch (error) {
        console.error("API Error:", error);
        setError("Failed to load topics. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const getRandomArticles = (articles, count) => {
    if (articles.length <= count) return articles;
    const shuffled = [...articles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && articles.length) {
      setIsTimerActive(false);
      navigate(`/prep/${encodeURIComponent(articles[0].title)}`, {
        state: { topicName: articles[0].title, topicDescription: articles[0].description },
      });
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, articles, navigate]);
  
  const formatTime = (seconds) => {
    return seconds.toString().padStart(2, "0");
  };

  return (
    <motion.div
      style={componentStyles.container}
      variants={animations.container}
      initial="hidden"
      animate="visible"
    >
      <Particles
        id="tsparticles"
        options={particlesConfig}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      />
      <motion.div
        style={styles.content}
        variants={animations.content}
      >
        <motion.h1
          style={styles.heading}
          variants={animations.heading}
        >
          Current Events
        </motion.h1>

        <motion.div
          style={styles.timerContainer}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FiClock size={24} style={styles.clockIcon} />
          <motion.span 
            style={{
              ...styles.timer,
              color: timer <= 5 ? colors.accent.red : colors.text.primary
            }}
          >
            {formatTime(timer)}s
          </motion.span>
        </motion.div>

        {isLoading && (
          <motion.div style={styles.stateContainer}>
            <FiLoader style={styles.loadingIcon} />
            <p>Loading Topics...</p>
          </motion.div>
        )}

        {error && (
           <motion.div style={styles.stateContainer}>
            <FiAlertTriangle style={styles.errorIcon} />
            <p>{error}</p>
          </motion.div>
        )}

          <AnimatePresence>
          {!isLoading && !error && articles.map((article, index) => (
            <motion.div
                key={index}
                style={styles.listItem}
                variants={animations.card}
                whileHover="hover"
                whileTap="tap"
                onClick={() =>
                  navigate(`/prep/${encodeURIComponent(article.title)}`, {
                    state: { topicName: article.title, topicDescription: article.description },
                  })
                }
                custom={index}
                layout
              >
              <div style={styles.articleContent}>
                <div style={styles.articleTitle}>{article.title}</div>
                  <div style={styles.articleDescription}>{article.description}</div>
                <div style={styles.articleSection}>Section: {article.section}</div>
              </div>
              <FiArrowRight />
            </motion.div>
            ))}
          </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  content: {
    ...componentStyles.content,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    ...componentStyles.heading,
    marginBottom: "2rem",
    background: `linear-gradient(45deg, ${colors.accent.red}, ${colors.accent.blue})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },
  timerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    background: "rgba(10, 25, 47, 0.7)",
    padding: "1rem 2rem",
    borderRadius: "50px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
    marginBottom: "2.5rem",
  },
  clockIcon: {
    color: colors.accent.red,
  },
  timer: {
    fontSize: "1.5rem",
    fontWeight: "700",
    transition: "color 0.3s ease",
    textShadow: `0 0 10px ${colors.accent.red}`,
  },
  listItem: {
    background: "rgba(10, 25, 47, 0.7)",
    padding: "1.5rem 2rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 20px 0 rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1.5rem",
    transition: "all 0.3s ease",
    width: '100%',
    maxWidth: '800px',
    marginBottom: '1rem',
  },
  articleContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  articleTitle: {
    fontWeight: "600",
    fontSize: '1.1rem',
    color: colors.text.primary,
  },
  articleDescription: {
    fontSize: "0.95rem",
    color: colors.text.secondary,
    lineHeight: 1.5,
  },
  articleSection: {
    fontSize: "0.85rem",
    color: 'rgba(255,255,255,0.5)',
    fontStyle: "italic",
    textTransform: "capitalize",
  },
  stateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: "2rem",
    borderRadius: "15px",
    background: "rgba(10, 25, 47, 0.7)",
    color: colors.text.secondary,
    width: '100%',
    maxWidth: '800px',
  },
  errorIcon: {
    fontSize: '2rem',
    color: colors.accent.red,
  },
  loadingIcon: {
    fontSize: '2rem',
    color: colors.accent.blue,
    animation: 'spin 1.5s linear infinite',
  },
};

// Add keyframes for spinning animation
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`;
document.head.appendChild(styleSheet);

export default CurrentScreen;