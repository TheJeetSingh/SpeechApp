import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { colors, animations, particlesConfig, componentStyles } from "../styles/theme";
import config from "../config";

const ExtempTopicSelectScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const extempType = location.state?.extempType || "NX"; // Default to National Extemp if not specified
  
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredTopic, setHoveredTopic] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        
        // Determine which section to fetch based on extempType
        let section = "world";
        if (extempType === "NX") {
          section = "us"; // National extemp uses US news
        } else if (extempType === "IX") {
          section = "world"; // International extemp uses world news
        }
        
        // Use the server endpoint for NYT API with the correct port in development
        const apiUrl = process.env.NODE_ENV === 'development' 
          ? `http://localhost:5001/api/nyt-news?section=${section}`
          : `${config.API_URL}/api/nyt-news?section=${section}`;
        
        console.log('Fetching news articles from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch articles: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data?.results?.length) {
          // Just use the headlines directly
          const headlines = data.results
            .filter(article => article.title)
            .slice(0, 3) // Take only 3 headlines
            .map(article => article.title);
          
          setTopics(headlines);
        } else {
          throw new Error("No articles available");
        }
      } catch (err) {
        console.error("Error fetching topics:", err);
        setError("Failed to load topics. Please check your connection and try again.");
        
        // Set fallback topics
        setTopics([
          extempType === "NX" 
            ? "Rising inflation concerns American consumers as prices continue to climb"
            : "European Union announces new climate accord with developing nations",
          extempType === "NX"
            ? "Supreme Court ruling reshapes voting rights landscape ahead of election"
            : "China's economic growth slows amid global trade tensions",
          extempType === "NX"
            ? "Tech companies face new regulations as Congress debates privacy bill"
            : "UN peacekeeping mission extended in conflict-torn region"
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopics();
  }, [extempType]);

  const handleSelectTopic = (topic) => {
    navigate("/extempPrep", { 
      state: { 
        extempType, 
        topicName: topic 
      }
    });
  };

  return (
    <motion.div
      style={componentStyles.container}
      variants={animations.container}
      initial="hidden"
      animate="visible"
    >
      <Particles id="tsparticles" options={particlesConfig} />
      <motion.div style={componentStyles.content} variants={animations.content}>
        <motion.h1 style={styles.heading} variants={animations.heading}>
          {extempType === "NX" ? "National Extemp" : "International Extemp"} Topic Selection
        </motion.h1>

        {isLoading ? (
          <motion.div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading topics...</p>
          </motion.div>
        ) : error ? (
          <motion.div style={styles.errorContainer}>
            <p style={styles.errorText}>{error}</p>
          </motion.div>
        ) : (
          <>
            <motion.p style={styles.instructions}>
              Select one of the following headlines for your {extempType === "NX" ? "National" : "International"} Extemporaneous speech:
            </motion.p>
            
            <motion.div style={styles.topicsContainer}>
              {topics.map((topic, index) => (
                <motion.div
                  key={index}
                  style={{
                    ...styles.topicCard,
                    ...(hoveredTopic === index ? styles.topicCardHovered : {})
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectTopic(topic)}
                  onHoverStart={() => setHoveredTopic(index)}
                  onHoverEnd={() => setHoveredTopic(null)}
                >
                  <motion.div style={styles.topicNumber}>{index + 1}</motion.div>
                  <motion.p style={styles.topicText}>{topic}</motion.p>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

const styles = {
  heading: {
    ...componentStyles.heading,
    marginBottom: "2rem",
    background: `linear-gradient(45deg, ${colors.text.primary}, ${colors.accent.blue})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto 2rem auto",
  },
  instructions: {
    fontSize: "1.2rem",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: "2rem",
    maxWidth: "800px",
    margin: "0 auto 2rem",
  },
  topicsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
  },
  topicCard: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "1.5rem 2rem",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
  },
  topicCardHovered: {
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
  },
  topicNumber: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: colors.accent.blue,
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "1.5rem",
    flexShrink: 0,
  },
  topicText: {
    fontSize: "1.2rem",
    fontWeight: "500",
    color: colors.text.primary,
    lineHeight: 1.5,
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem",
    height: "300px",
  },
  loadingSpinner: {
    width: "50px",
    height: "50px",
    border: `4px solid rgba(255, 255, 255, 0.1)`,
    borderRadius: "50%",
    borderTop: `4px solid ${colors.accent.blue}`,
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "1.5rem",
    color: colors.text.primary,
    fontSize: "1.2rem",
  },
  errorContainer: {
    padding: "2rem",
    background: "rgba(255, 100, 100, 0.1)",
    borderRadius: "12px",
    border: `1px solid ${colors.accent.red}`,
    maxWidth: "800px",
    width: "90%",
    margin: "0 auto",
  },
  errorText: {
    color: colors.accent.red,
    textAlign: "center",
    fontSize: "1.1rem",
  },
};

export default ExtempTopicSelectScreen; 