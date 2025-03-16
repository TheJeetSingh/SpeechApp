import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion, useScroll, useTransform } from "framer-motion";
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { FiArrowDown } from "react-icons/fi";

// Modal Component
function Modal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <motion.div
      style={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={styles.modalContent}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <h2 style={styles.modalTitle}>Feedback</h2>
        <p style={styles.modalText}>
          Is the problem really urgent and not a matter of your own input? If so, text me at{" "}
          <strong>‪(650) 273-6590‬</strong>.
        </p>
        <div style={styles.modalButtons}>
          <motion.button
            style={styles.modalButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
          >
            Continue
          </motion.button>
          <motion.button
            style={styles.modalButtonCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Header Component
function Header({ onFeedbackClick }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserName("");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div style={styles.header}>
      <h1 style={styles.headerTitle}>ARTICULATE</h1>
      <div style={styles.hamburger} onClick={toggleMenu}>
        <div style={{ ...styles.hamburgerLine, transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></div>
        <div style={{ ...styles.hamburgerLine, opacity: menuOpen ? 0 : 1 }}></div>
        <div style={{ ...styles.hamburgerLine, transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></div>
      </div>
      <div style={{ ...styles.headerButtons, display: menuOpen || window.innerWidth > 768 ? 'flex' : 'none' }}>
        {userName ? (
          <>
            <motion.button
              style={styles.nameButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {userName}
            </motion.button>
            <motion.button
              style={styles.logoutButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
            >
              Log Out
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              style={styles.signInButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
            >
              Sign In
            </motion.button>
            <motion.button
              style={styles.signUpButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </motion.button>
          </>
        )}
        <motion.button
          style={styles.feedbackButton}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFeedbackClick}
        >
          Give Feedback
        </motion.button>
      </div>
    </div>
  );
}

// HomeScreen Component
function HomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Parallax effect with Framer Motion
  const { scrollYProgress } = useScroll({ container: containerRef });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  // Initialize particles
  const particlesInit = async (engine) => {
    console.log("Particles engine initialized", engine);
  };

  const particlesLoaded = async (container) => {
    console.log("Particles loaded", container);
  };

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

  const handleFeedbackClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSe4OOpOy9YXIis2tJIfMBpcQ6yIQQetQ9gm91YgdCt6dbpzbw/viewform?usp=dialog";
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sections = [
    {
      id: "impromptu",
      title: "Impromptu",
      description: "Quick thinking, spontaneous speeches. 2 minutes",
      background: "linear-gradient(135deg, #1e3c72, #2a5298)",
      navigateTo: "/topics",
      icon: "⚡️",
    },
    {
      id: "interp",
      title: "Interp",
      description: "Perform your own interpretation of a piece.",
      background: "linear-gradient(135deg, #6a11cb, #2575fc)",
      navigateTo: "/speech",
      icon: "🎭",
    },
    {
      id: "original",
      title: "Original",
      description: "Craft and present original content.",
      background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
      navigateTo: "/speech",
      icon: "✏️",
    },
    {
      id: "extemp",
      title: "Extemp",
      description: "Speak on current events with depth.",
      background: "linear-gradient(135deg, #00c853, #00e676)",
      navigateTo: "/beta",
      icon: "🌎",
    },
  ];

  return (
    <div style={styles.container} ref={containerRef}>
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          particles: {
            number: {
              value: 50,
            },
            size: {
              value: 3,
            },
            color: {
              value: "#ffffff",
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#ffffff",
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 2,
            },
          },
          interactivity: {
            events: {
              onhover: {
                enable: true,
                mode: "repulse",
              },
            },
          },
        }}
      />

      {/* Parallax Background Layers */}
      <motion.div
        style={{ ...styles.parallaxLayer, y: y1, backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}
      />
      <motion.div
        style={{ ...styles.parallaxLayer, y: y2, backgroundImage: "url('https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}
      />
      <motion.div
        style={{ ...styles.parallaxLayer, y: y3, backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}
      />

      <Header onFeedbackClick={handleFeedbackClick} />

      {/* Welcome Screen */}
      <div style={styles.welcomeScreen}>
        <motion.h1
          style={styles.heading}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to Speech App{userName ? `, ${userName}` : ""}
        </motion.h1>
        <div style={styles.navDots}>
          {sections.map((section, index) => (
            <motion.div
              key={index}
              style={styles.navDot}
              whileHover={{ scale: 1.5, backgroundColor: "#fff" }}
              onClick={() => scrollToSection(section.id)}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            />
          ))}
        </div>
        <motion.div
          style={styles.downArrow}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          onClick={() => scrollToSection(sections[0].id)}
        >
          <FiArrowDown size={24} />
        </motion.div>
      </div>

      {/* Full-page sections */}
      {sections.map((section, index) => (
        <div
          key={section.id}
          id={section.id}
          style={{ ...styles.fullPageSection, background: section.background }}
        >
          <div style={styles.sectionContent}>
            <div style={styles.sectionHeader}>
              <motion.div
                style={styles.sectionIcon}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {section.icon}
              </motion.div>
              <motion.h2
                style={styles.sectionTitle}
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {section.title}
              </motion.h2>
            </div>
            <motion.p
              style={styles.sectionDescription}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {section.description}
            </motion.p>
            <motion.button
              style={styles.ctaButton}
              whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              onClick={() => navigate(section.navigateTo)}
            >
              Get Started <span style={styles.buttonArrow}>→</span>
            </motion.button>
          </div>
        </div>
      ))}

      <Modal isOpen={isModalOpen} onClose={handleClose} onConfirm={handleConfirm} />
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    color: "#fff",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    overflow: "auto",
  },
  particles: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -2,
  },
  parallaxLayer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    zIndex: -1,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.8rem 1.5rem",
    background: "rgba(30, 60, 114, 0.8)",
    backdropFilter: "blur(10px)",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 4000,
  },
  headerTitle: {
    fontSize: "clamp(1.2rem, 5vw, 2rem)",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
    letterSpacing: "1px",
  },
  hamburger: {
    display: "none",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "30px",
    height: "22px",
    cursor: "pointer",
    zIndex: 4001,
    '@media (max-width: 768px)': {
      display: "flex",
    },
  },
  hamburgerLine: {
    width: "100%",
    height: "3px",
    backgroundColor: "#fff",
    borderRadius: "3px",
    transition: "all 0.3s ease",
  },
  headerButtons: {
    display: "flex",
    gap: "0.8rem",
    alignItems: "center",
    '@media (max-width: 768px)': {
      position: "absolute",
      top: "60px",
      right: "0",
      flexDirection: "column",
      width: "100%",
      background: "rgba(30, 60, 114, 0.95)",
      padding: "1rem",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      zIndex: 4000,
    },
  },
  signInButton: {
    padding: "0.5rem 1rem",
    fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #00c853, #00e676)",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    '@media (max-width: 768px)': {
      width: "100%",
      margin: "0.3rem 0",
    },
  },
  signUpButton: {
    padding: "0.5rem 1rem",
    fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #00bcd4, #00e5ff)",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    '@media (max-width: 768px)': {
      width: "100%",
      margin: "0.3rem 0",
    },
  },
  feedbackButton: {
    padding: "0.5rem 1rem",
    fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #C70039, #ff416c)",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    '@media (max-width: 768px)': {
      width: "100%",
      margin: "0.3rem 0",
    },
  },
  nameButton: {
    padding: "0.5rem 1rem",
    fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #4CAF50, #66bb6a)",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    '@media (max-width: 768px)': {
      width: "100%",
      margin: "0.3rem 0",
    },
  },
  logoutButton: {
    padding: "0.5rem 1rem",
    fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #ff4d4d, #ff6b6b)",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    '@media (max-width: 768px)': {
      width: "100%",
      margin: "0.3rem 0",
    },
  },
  welcomeScreen: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    padding: "1rem",
    textAlign: "center",
  },
  heading: {
    fontSize: "clamp(2rem, 8vw, 3.5rem)",
    fontWeight: "700",
    marginBottom: "1rem",
    letterSpacing: "1px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  },
  navDots: {
    display: "flex",
    gap: "0.8rem",
    marginBottom: "1.5rem",
  },
  navDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  downArrow: {
    fontSize: "2rem",
    marginTop: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  fullPageSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    padding: "1rem",
    textAlign: "center",
    position: "relative",
  },
  sectionContent: {
    maxWidth: "800px",
    width: "90%",
    margin: "0 auto",
  },
  sectionHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  sectionIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  sectionTitle: {
    fontSize: "clamp(1.5rem, 6vw, 3rem)",
    fontWeight: "700",
    marginBottom: "1rem",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  },
  sectionDescription: {
    fontSize: "clamp(0.9rem, 3vw, 1.2rem)",
    maxWidth: "90%",
    lineHeight: "1.6",
    marginBottom: "1.5rem",
  },
  ctaButton: {
    padding: "0.75rem 1.5rem",
    fontSize: "clamp(0.9rem, 3vw, 1rem)",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  buttonArrow: {
    fontSize: "1.2rem",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(5px)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    padding: "1.5rem",
    width: "90%",
    maxWidth: "clamp(300px, 80vw, 450px)",
    textAlign: "center",
    boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    fontSize: "clamp(1.2rem, 5vw, 1.8rem)",
    marginBottom: "1rem",
    fontWeight: "bold",
    color: "#333",
  },
  modalText: {
    fontSize: "clamp(0.8rem, 3vw, 1rem)",
    marginBottom: "1.5rem",
    color: "#555",
    lineHeight: "1.5",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  modalButton: {
    padding: "0.75rem 1.5rem",
    fontSize: "clamp(0.8rem, 3vw, 1rem)",
    backgroundColor: "#28a745",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s ease",
    fontWeight: "600",
  },
  modalButtonCancel: {
    padding: "0.75rem 1.5rem",
    fontSize: "clamp(0.8rem, 3vw, 1rem)",
    backgroundColor: "#dc3545",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s ease",
    fontWeight: "600",
  },
};

export default HomeScreen;