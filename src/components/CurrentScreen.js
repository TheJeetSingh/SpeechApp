import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
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
        const response = await fetch(`${config.API_URL}${config.NEWS_ENDPOINT}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        // Check if response is ok and content-type is application/json
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType?.includes("application/json")) {
          setError("Unable to fetch current topics. Please try again later.");
          return;
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error("Failed to parse JSON:", jsonError);
          setError("Invalid response format. Please try again later.");
          return;
        }

        if (data?.articles?.length) {
          const processedArticles = data.articles.map(article => ({
            title: article.title || '',
            description: article.description || ''
          }));
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
    <motion.div
      style={componentStyles.container}
      variants={animations.container}
      initial="hidden"
      animate="visible"
    >
      <Particles
        id="tsparticles"
        options={particlesConfig}
      />
      <motion.div
        style={componentStyles.content}
        variants={animations.content}
      >
        {isLoading && (
          <motion.div
            style={styles.loading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Loading...
          </motion.div>
        )}
        {error && (
          <motion.div
            style={styles.error}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {error}
          </motion.div>
        )}
        <motion.div style={componentStyles.timer} variants={animations.content}>
          Time Left: {timer}s
        </motion.div>
        <motion.h1
          style={componentStyles.heading}
          variants={animations.heading}
        >
          Current Events
        </motion.h1>
        <motion.ul
          style={styles.list}
          variants={animations.content}
        >
          <AnimatePresence>
            {articles.map((article, index) => (
              <motion.li
                key={index}
                style={styles.listItem}
                variants={animations.card}
                whileHover="hover"
                whileTap="tap"
                onClick={() =>
                  navigate(`/prep/${encodeURIComponent(article.title)}`, {
                    state: { topicName: article.title },
                  })
                }
                custom={index}
                layout
              >
                {article.title}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  list: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
  },
  listItem: {
    ...componentStyles.card,
    fontSize: "1.2rem",
    padding: "20px 32px",
    background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.purple}88)`,
    color: colors.text.primary,
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
    lineHeight: 1.6,
  },
  error: {
    padding: "15px 20px",
    borderRadius: "10px",
    background: `linear-gradient(135deg, ${colors.accent.red}44, ${colors.accent.red}22)`,
    color: colors.accent.red,
    fontSize: "1.1rem",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: "20px",
    backdropFilter: "blur(5px)",
    border: `1px solid ${colors.accent.red}44`,
  },
  loading: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: "20px",
  },
};

export default CurrentScreen;