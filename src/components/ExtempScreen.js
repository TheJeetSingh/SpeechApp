import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import config from "../config";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";

const ExtempScreen = () => {
  const [articles, setArticles] = useState([]);
  const [timer, setTimer] = useState(60); // 1 minute for extemp
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to filter relevant extemp topics
  const filterExtempArticles = (articles) => {
    // Expanded list of keywords for extemp topics
    const relevantKeywords = [
      // Political and governmental topics
      "politics", "election", "government", "democracy", "president", "congress", "senate", 
      "parliament", "law", "policy", "minister", "campaign", "vote", "bill", "legislation",
      
      // International relations
      "international", "global", "foreign", "diplomatic", "relations", "embassy", "summit",
      "treaty", "alliance", "united nations", "NATO", "EU", "European Union", "G20", "G7",
      
      // Social issues
      "climate change", "healthcare", "education", "equality", "rights", "justice",
      "immigration", "refugee", "welfare", "poverty", "homelessness", "discrimination",
      
      // Economics
      "economy", "trade", "finance", "market", "inflation", "recession", "budget", "debt",
      "investment", "stock", "currency", "economic", "fiscal", "monetary", "tax",
      
      // Conflict and security
      "conflict", "security", "war", "peace", "military", "defense", "terrorism", "cyber",
      "intelligence", "weapon", "nuclear", "army", "troops", "soldiers", "attack",
      
      // Reform and policy
      "reform", "policy", "initiative", "regulation", "deregulation", "solution",
      "infrastructure", "development", "program", "strategy", "framework",
      
      // Technology and science
      "technology", "innovation", "artificial intelligence", "AI", "digital", "data",
      "science", "research", "discovery", "breakthrough", "space", "medical", "vaccine",
      
      // General news interest
      "crisis", "controversy", "debate", "agreement", "decision", "announcement", "study",
      "report", "analysis", "investigation", "opinion", "perspective"
    ];

    // Try to find articles with relevant keywords
    const filteredArticles = articles.filter(article =>
      relevantKeywords.some(keyword => 
        article.title?.toLowerCase().includes(keyword.toLowerCase()) || 
        article.description?.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    // If we find at least some articles, return them
    if (filteredArticles.length > 0) {
      return filteredArticles;
    }
    
    // If no articles matched our keywords, just return all articles
    // This ensures we always have topics even if they don't match our keywords
    console.log("No articles matched extemp keywords, returning all articles as fallback");
    return articles;
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiUrl = `${config.API_URL}${config.NEWS_ENDPOINT}`;
        console.log(`Fetching extemp topics from: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
          // Let the browser handle CORS automatically
        });

        // Check if response is ok and content-type is application/json
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          console.error(`Error response: ${response.status}, ${response.statusText}`);
          throw new Error(`Failed to fetch topics (${response.status})`);
        }

        if (!contentType?.includes("application/json")) {
          throw new Error("Invalid response format from server");
        }

        const data = await response.json();
        
        if (!data?.articles?.length) {
          throw new Error("No articles available");
        }

        const processedArticles = data.articles
          .filter(article => article.title && article.description) // Only keep articles with both title and description
          .map(article => ({
            title: article.title.trim(),
            description: article.description.trim()
          }));

        if (processedArticles.length === 0) {
          throw new Error("No valid articles found");
        }

        // Filter for extemp topics and get 2 random ones
        const filteredArticles = filterExtempArticles(processedArticles);
        if (filteredArticles.length === 0) {
          throw new Error("No relevant extemp topics found");
        }

        setArticles(getRandomArticles(filteredArticles, 2));
      } catch (error) {
        console.error("Error fetching news topics:", error);
        setError(error.message || "Failed to load topics. Please try again.");
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
      navigate("/extempPrep", { 
        state: { topicName: articles[0].title } 
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
          Choose an Extemp Topic
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
                  navigate("/extempPrep", {
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
    background: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.blue}88)`,
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

export default ExtempScreen;
