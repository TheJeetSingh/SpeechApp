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

  const setDefaultTopics = () => {
    const defaultTopics = [
      {
        title: "Should governments invest more in renewable energy to combat climate change?",
        description: "Discuss the economic and environmental implications of increased government investment in renewable energy sources."
      },
      {
        title: "Is social media having a positive or negative impact on democratic processes?",
        description: "Examine how social media platforms influence elections, public discourse, and political polarization."
      },
      {
        title: "How should countries balance national security with individual privacy rights?",
        description: "Analyze the tensions between security measures and civil liberties in the digital age."
      },
      {
        title: "What role should artificial intelligence play in healthcare decision-making?",
        description: "Evaluate the benefits and risks of using AI to diagnose conditions and recommend treatments."
      },
      {
        title: "Is globalization still beneficial for developing economies?",
        description: "Consider how global trade and economic integration affect economic growth and inequality."
      }
    ];
    
    setArticles(getRandomArticles(defaultTopics, 2));
  };

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiUrl = `${config.API_URL}${config.NEWS_ENDPOINT}`;
      console.log(`Fetching extemp topics from: ${apiUrl}`);
      
      // Try with standard CORS mode first
      try {
        console.log("Attempting fetch with standard CORS mode");
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });

        // Process the response if successful
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (!contentType?.includes("application/json")) {
            throw new Error("Invalid response format from server");
          }

          const data = await response.json();
          
          if (data?.articles?.length) {
            const processedArticles = data.articles
              .filter(article => article.title && article.description)
              .map(article => ({
                title: article.title.trim(),
                description: article.description.trim()
              }));

            if (processedArticles.length > 0) {
              console.log(`Fetched ${processedArticles.length} topics from API`);
              const extempTopics = filterExtempArticles(processedArticles);
              setArticles(getRandomArticles(extempTopics, 2)); 
              return; // Exit if successful
            }
          }
          throw new Error("No topics found in API response");
        } else {
          throw new Error(`Server returned status ${response.status}`);
        }
      } catch (initialError) {
        console.error("Initial fetch attempt failed:", initialError);
        
        // Fall back to default topics instead of attempting no-cors mode
        // (no-cors mode would not allow reading the response anyway)
        throw new Error("Could not fetch topics from API");
      }
    } catch (error) {
      console.error("Error fetching news topics:", error);
      console.log("Using fallback topics due to API error");
      setDefaultTopics();
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomArticles = (articles, count) => {
    if (articles.length <= count) return articles;
    const selectedIndexes = new Set();
    while (selectedIndexes.size < count) {
      selectedIndexes.add(Math.floor(Math.random() * articles.length));
    }
    return Array.from(selectedIndexes).map((index) => articles[index]);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

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
        <motion.div style={componentStyles.timerContainer} variants={animations.content}>
          <div style={styles.clockIcon}>
            {/* Clock icon SVG or image */}
          </div>
          <div style={styles.timer}>
            Time Left: {timer}s
          </div>
        </motion.div>
        <motion.h1
          style={componentStyles.heading}
          variants={animations.heading}
        >
          Choose an Extemp Topic
        </motion.h1>
        <motion.div style={styles.topicsContainer} variants={animations.content}>
          <AnimatePresence>
            {articles.map((article, index) => (
              <motion.div
                key={index}
                style={styles.newsCard}
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
                <h2 style={styles.newsTitle}>{article.title}</h2>
                <p style={styles.newsDescription}>{article.description}</p>
                <div style={styles.newsSource}>
                  <span style={styles.newsDate}>{article.source?.name || "Unknown Source"}</span>
                  <a style={styles.readMore} href={article.url || "#"}>Read More</a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  timerContainer: {
    backgroundColor: "rgba(42, 82, 152, 0.95)",
    padding: "1rem 2rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.5)",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
    width: "fit-content",
    margin: "0 auto 2rem",
  },
  clockIcon: {
    color: "#FFFFFF",
  },
  timer: {
    fontSize: "1.8rem",
    fontWeight: "700",
    transition: "color 0.3s ease",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    color: "#FFFFFF",
  },
  topicsContainer: {
    padding: "1rem",
    width: "90%",
    maxWidth: "800px",
    margin: "0 auto",
  },
  error: {
    backgroundColor: "rgba(255, 82, 82, 0.9)",
    color: "#FFFFFF",
    padding: "1rem",
    borderRadius: "10px",
    textAlign: "center",
    margin: "1rem auto",
    width: "90%",
    maxWidth: "600px",
  },
  loading: {
    color: "#FFFFFF",
    textAlign: "center",
    margin: "2rem auto",
  },
  newsCard: {
    backgroundColor: "rgba(42, 82, 152, 0.95)",
    padding: "1.5rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.5)",
    marginBottom: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  newsTitle: {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#FFFFFF",
    margin: 0,
  },
  newsDescription: {
    fontSize: "1rem",
    color: "#FFFFFF",
    margin: 0,
    lineHeight: 1.6,
  },
  newsSource: {
    fontSize: "0.9rem",
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newsDate: {
    fontSize: "0.8rem",
    color: "rgba(255, 255, 255, 0.7)",
  },
  readMore: {
    color: "#2196F3",
    textDecoration: "none",
    display: "inline-block",
    padding: "0.5rem 1rem",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  },
};

export default ExtempScreen;
