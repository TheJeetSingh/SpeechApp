import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AICoachScreen() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.name);
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  }, []);

  // Handle start live session
  const handleStartSession = () => {
    navigate("/chat-session");
  };

  return (
    <div style={{...styles.container, backgroundColor: "#ffffff"}}>
      {/* Background is now solid white */}
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>🤖</span>
          <h1 style={styles.logo} onClick={() => navigate("/home")}>ARTICULATE</h1>
        </div>
        <button style={styles.backButton} onClick={() => navigate("/home")}>
          Back to Home
        </button>
      </header>
      
      {/* Main Content */}
      <main style={styles.main}>
        <motion.div
          style={styles.contentBox}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={styles.title}>
            AI Speech Coach
            <span style={styles.betaBadge}>BETA</span>
          </h1>
          
          <p style={styles.subtitle}>
            {userName 
              ? `Welcome, ${userName}! Our AI coach is ready to help you improve your speaking skills.` 
              : "Welcome! Our AI coach is ready to help you improve your speaking skills."}
          </p>
          
          <div style={styles.featuresList}>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>🎤</div>
              <div style={styles.featureContent}>
                <h3>Speech Analysis</h3>
                <p>Chat with our AI coach for instant feedback on your speaking skills and techniques.</p>
              </div>
            </div>
            
            <div style={styles.feature}>
              <div style={styles.featureIcon}>📊</div>
              <div style={styles.featureContent}>
                <h3>Detailed Metrics</h3>
                <p>Get insights on pace, clarity, filler words, and more with actionable suggestions.</p>
              </div>
            </div>
            
            <div style={styles.feature}>
              <div style={styles.featureIcon}>🧠</div>
              <div style={styles.featureContent}>
                <h3>Personalized Coaching</h3>
                <p>Receive tailored advice based on your speaking style and improvement areas.</p>
              </div>
            </div>
            
            <div style={styles.feature}>
              <div style={styles.featureIcon}>📈</div>
              <div style={styles.featureContent}>
                <h3>Progress Tracking</h3>
                <p>Monitor your improvement over time with detailed progress reports.</p>
              </div>
            </div>
          </div>
          
          <div style={styles.actionButtons}>
            <motion.button 
              style={{...styles.recordButton, width: "100%", maxWidth: "400px"}}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartSession}
            >
              Start Live Session
            </motion.button>
          </div>
          
          <div style={styles.comingSoon}>
            <p>
              <strong>Coming Soon:</strong> Advanced feedback, rhetorical analysis, 
              gesture recognition, and more!
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    width: "100%",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(0, 119, 182, 0.9)",
    backdropFilter: "blur(10px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  logoIcon: {
    fontSize: "1.5rem",
    color: "#0077B6",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "700",
    margin: 0,
    background: "linear-gradient(45deg, #fff, #90E0EF)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    cursor: "pointer",
  },
  backButton: {
    padding: "0.5rem 1rem",
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  main: {
    flex: 1,
    width: "100%",
    maxWidth: "1200px",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  contentBox: {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "2.5rem",
    width: "100%",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
    color: "#333",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
    color: "#0077B6",
    position: "relative",
    display: "inline-block",
  },
  betaBadge: {
    fontSize: "0.8rem",
    fontWeight: "600",
    padding: "0.2rem 0.5rem",
    background: "#0077B6",
    color: "white",
    borderRadius: "20px",
    position: "absolute",
    top: 0,
    right: "-50px",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "3rem",
    color: "#555",
  },
  featuresList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
    marginBottom: "3rem",
    textAlign: "left",
  },
  feature: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
  },
  featureIcon: {
    fontSize: "2rem",
    color: "#0077B6",
    flexShrink: 0,
  },
  featureContent: {
    "& h3": {
      margin: "0 0 0.5rem 0",
      fontSize: "1.2rem",
      color: "#0077B6",
    },
    "& p": {
      margin: 0,
      fontSize: "0.95rem",
      color: "#666",
      lineHeight: 1.6,
    },
  },
  actionButtons: {
    display: "flex",
    gap: "1.5rem",
    justifyContent: "center",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  recordButton: {
    padding: "1rem 2rem",
    background: "linear-gradient(135deg, #0077B6, #00B4D8)",
    color: "white",
    border: "none",
    borderRadius: "30px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  comingSoon: {
    marginTop: "2rem",
    padding: "1rem",
    background: "rgba(0, 119, 182, 0.05)",
    borderRadius: "10px",
    fontSize: "0.9rem",
    color: "#555",
    border: "1px dashed #0077B6",
  },
};

export default AICoachScreen; 