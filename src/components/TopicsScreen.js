import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import abstractTopics from '../data/abstract';
import concreteTopics from '../data/concrete';
import quotesData from '../data/quotes';
import config from "../config";

function TopicsScreen() {
  const navigate = useNavigate();
  const headingText = "Choose a Topic";
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [currentTopics, setCurrentTopics] = useState([]);
  const hoverTimerRef = useRef(null);

  // Fallback current event topics
  const fallbackCurrentTopics = [
    "Artificial Intelligence Advancements",
    "Climate Change Solutions",
    "Global Economic Trends"
  ];

  useEffect(() => {
    const fetchCurrentTopics = async () => {
      try {
        const response = await fetch(`${config.API_URL}${config.NEWS_ENDPOINT}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          console.error('API Response not OK:', response.status);
          setCurrentTopics(fallbackCurrentTopics);
          return;
        }

        const data = await response.json();
        if (data.articles?.length) {
          const processedArticles = data.articles.map(article => article.title || '');
          setCurrentTopics(getRandomArticles(processedArticles, 3));
        } else {
          setCurrentTopics(fallbackCurrentTopics);
        }
      } catch (error) {
        console.error("API Error:", error);
        setCurrentTopics(fallbackCurrentTopics);
      }
    };

    fetchCurrentTopics();
  }, []);

  const getRandomArticles = (articles, count) => {
    if (articles.length <= count) return articles;
    const selectedIndexes = new Set();
    while (selectedIndexes.size < count) {
      selectedIndexes.add(Math.floor(Math.random() * articles.length));
    }
    return Array.from(selectedIndexes).map((index) => articles[index]);
  };

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (topic) => {
    setIsHovering(true);
    hoverTimerRef.current = setTimeout(() => {
      setSelectedTopic(topic);
    }, 2000);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
  };

  // Sample topics for each category
  const sampleTopics = {
    quotes: quotesData.slice(0, 3),
    concrete: concreteTopics.slice(0, 3),
    abstract: abstractTopics.slice(0, 3),
    current: [
      "Climate change initiatives",
      "Technological innovations",
      "Global economic trends"
    ]
  };

  const handleTopicSelect = (topicType) => {
    switch (topicType) {
      case "quotes":
        navigate("/quote");
        break;
      case "concrete":
        navigate("/concrete");
        break;
      case "abstract":
        navigate("/abstract");
        break;
      case "current":
        navigate("/current");
        break;
      default:
        break;
    }
  };

  const particlesOptions = {
    particles: {
      number: {
        value: 60,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ["#ffffff", "#87CEEB", "#00BFFF"]
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5,
        random: true,
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        outModes: "out",
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: {
          enable: true,
          mode: ["grab", "bubble"]
        },
        onClick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 1
          }
        },
        bubble: {
          distance: 200,
          size: 12,
          duration: 2,
          opacity: 0.8,
          speed: 3
        },
        push: {
          quantity: 4
        }
      }
    },
    retina_detect: true,
    background: {
      color: "transparent",
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover"
    }
  };

  const topics = [
    {
      type: "quotes",
      title: "Quotes",
      description: "Practice with famous quotes and sayings",
      gradient: "linear-gradient(135deg, #FF6B6B, #FF8E8E)",
      icon: "💭"
    },
    {
      type: "concrete",
      title: "Concrete",
      description: "Speak about tangible objects and experiences",
      gradient: "linear-gradient(135deg, #4CAF50, #66BB6A)",
      icon: "🎯"
    },
    {
      type: "abstract",
      title: "Abstract",
      description: "Explore conceptual and theoretical topics",
      gradient: "linear-gradient(135deg, #2196F3, #64B5F6)",
      icon: "🌌"
    },
    {
      type: "current",
      title: "Current Events",
      description: "Discuss contemporary issues and news",
      gradient: "linear-gradient(135deg, #9C27B0, #BA68C8)",
      icon: "📰"
    }
  ];

  return (
    <div style={styles.container}>
      <Particles
        id="tsparticles"
        options={particlesOptions}
      />
      <motion.div
        style={styles.content}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          style={styles.heading}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {headingText}
        </motion.h1>
        <div style={styles.buttonContainer}>
          {topics.map((topic, index) => (
            <motion.div
              key={topic.type}
              layoutId={`topic-${topic.type}`}
              style={{
                ...styles.topicCard,
                background: topic.gradient
              }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => handleMouseEnter(topic)}
              onMouseLeave={handleMouseLeave}
            >
              <div style={styles.topicIcon}>{topic.icon}</div>
              <h2 style={styles.topicTitle}>{topic.title}</h2>
              <p style={styles.topicDescription}>{topic.description}</p>
              {isHovering && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  style={styles.progressBar}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedTopic && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1000
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              ...styles.expandedCard,
              background: selectedTopic.gradient,
              transform: "none",
              maxWidth: "none",
              borderRadius: 0,
            }}
          >
            <motion.div style={styles.expandedContent}>
              <div style={styles.expandedHeader}>
                <div style={styles.topicIcon}>{selectedTopic.icon}</div>
                <h2 style={styles.expandedTitle}>{selectedTopic.title}</h2>
                <p style={styles.expandedDescription}>{selectedTopic.description}</p>
              </div>
              <div style={styles.sampleTopicsContainer}>
                <h3 style={styles.sampleTopicsTitle}>Sample Topics</h3>
                <div style={styles.sampleTopicsList}>
                  {sampleTopics[selectedTopic.type].map((sample, index) => (
                    <motion.div
                      key={index}
                      style={styles.sampleTopic}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {sample}
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  style={styles.startButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTopicSelect(selectedTopic.type);
                  }}
                >
                  Start Practice
                </motion.button>
              </div>
              <motion.button
                style={styles.closeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTopic(null);
                }}
              >
                ×
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "clamp(1rem, 5vw, 3rem)",
    position: "relative",
    overflow: "hidden",
  },
  content: {
    width: "100%",
    maxWidth: "1200px",
    zIndex: 1,
    padding: "clamp(1rem, 3vw, 2rem)",
    backdropFilter: "blur(10px)",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },
  heading: {
    fontSize: "clamp(2rem, 6vw, 3.5rem)",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "clamp(2rem, 5vw, 3rem)",
    background: "linear-gradient(45deg, #fff, #87CEEB)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  },
  buttonContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "clamp(1rem, 3vw, 2rem)",
    width: "100%",
    padding: "clamp(0.5rem, 2vw, 1rem)",
  },
  topicCard: {
    padding: "clamp(1.5rem, 4vw, 2rem)",
    borderRadius: "15px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    backdropFilter: "blur(5px)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    position: "relative",
    overflow: "hidden",
  },
  topicIcon: {
    fontSize: "clamp(2rem, 6vw, 3rem)",
    marginBottom: "1rem",
    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
  },
  topicTitle: {
    fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
    fontWeight: "600",
    marginBottom: "0.5rem",
    background: "linear-gradient(45deg, #fff, rgba(255, 255, 255, 0.8))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  topicDescription: {
    fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
    opacity: 0.9,
    lineHeight: 1.4,
    maxWidth: "280px",
    margin: "0 auto",
  },
  "@media (max-width: 768px)": {
    container: {
      padding: "1rem",
      paddingTop: "80px",
    },
    buttonContainer: {
      gridTemplateColumns: "1fr",
    },
    topicCard: {
      margin: "0.5rem 0",
    },
    expandedCard: {
      width: "95%",
      height: "90vh",
      padding: "1rem",
    },
    sampleTopicsList: {
      gridTemplateColumns: "1fr",
      gap: "1rem",
    },
    sampleTopicsContainer: {
      padding: "1.5rem",
      width: "90%",
    },
    expandedContent: {
      gap: "1rem",
    },
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(8px)",
    zIndex: 100,
  },
  expandedCard: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    padding: "2rem",
    color: "#fff",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
    border: "none",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  expandedContent: {
    width: "100%",
    maxWidth: "1200px",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    position: "relative",
    paddingTop: "10vh",
  },
  expandedHeader: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  expandedTitle: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: "700",
    marginBottom: "1rem",
    background: "linear-gradient(45deg, #fff, rgba(255, 255, 255, 0.8))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
  },
  expandedDescription: {
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
    opacity: 0.9,
    maxWidth: "600px",
    margin: "0 auto",
  },
  sampleTopicsContainer: {
    width: "95%",
    padding: "3rem",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    backdropFilter: "blur(5px)",
    marginBottom: "10px",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "1200px",
  },
  sampleTopicsTitle: {
    fontSize: "clamp(1.5rem, 3vw, 2rem)",
    fontWeight: "600",
    marginBottom: "2rem",
    textAlign: "center",
  },
  sampleTopicsList: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "2rem",
    marginBottom: "2rem",
    padding: "1rem",
  },
  sampleTopic: {
    padding: "1.5rem",
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "15px",
    fontSize: "clamp(1rem, 2vw, 1.2rem)",
    lineHeight: 1.5,
    transition: "all 0.3s ease",
    cursor: "pointer",
    minHeight: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.2)",
      transform: "translateY(-2px)",
    },
  },
  startButton: {
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    fontWeight: "600",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#333",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "block",
    margin: "0 auto",
    marginTop: "2rem",
    marginBottom: "10px",
    width: "200px",
  },
  closeButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
    fontSize: "1.5rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.3)",
      transform: "rotate(90deg)",
    },
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: "4px",
    background: "rgba(255, 255, 255, 0.5)",
    borderRadius: "0 0 15px 15px",
  },
};

export default TopicsScreen;