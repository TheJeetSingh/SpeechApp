import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion, useScroll, useTransform } from "framer-motion";
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { FiArrowDown } from "react-icons/fi";

// Add TypeWriter component before HomeScreen component
const TypeWriter = ({ text, delay = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentIndex < text.length) {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(currentIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000); // Wait 2s before deleting
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(prev => prev.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex(0);
        }
      }
    }, isDeleting ? delay / 2 : delay);

    return () => clearTimeout(timeout);
  }, [currentIndex, text, delay, isDeleting, displayText]);

  return (
    <motion.span
      style={{
        display: "inline-block",
        background: "linear-gradient(45deg, #fff, #87CEEB, #1E90FF)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        |
      </motion.span>
    </motion.span>
  );
};

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
  const [menuOpen, setMenuOpen] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserName("");
    setMenuOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <div style={styles.header}>
      <h1 style={styles.headerTitle}>ARTICULATE</h1>
      <div style={styles.settingsContainer}>
        <motion.div 
          style={styles.settingsIcon} 
          onClick={toggleMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ⚙️
        </motion.div>
        {menuOpen && (
          <motion.div 
            style={styles.settingsDropdown}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {userName ? (
              <>
                <motion.div style={styles.userName}>
                  {userName}
                </motion.div>
                <motion.button 
                  style={styles.dropdownButton} 
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Log Out
                </motion.button>
              </>
            ) : (
              <>
                <motion.button 
                  style={styles.dropdownButton} 
                  onClick={() => handleNavigation("/login")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
                <motion.button 
                  style={styles.dropdownButton} 
                  onClick={() => handleNavigation("/signup")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </>
            )}
            <motion.button 
              style={styles.dropdownButton} 
              onClick={() => { onFeedbackClick(); setMenuOpen(false); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Give Feedback
            </motion.button>
          </motion.div>
        )}
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

  const particlesOptions = {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ["#ffffff", "#87CEEB", "#00BFFF", "#1E90FF"]
      },
      shape: {
        type: ["circle", "star"],
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
        width: 1,
        triangles: {
          enable: true,
          color: "#ffffff",
          opacity: 0.1
        }
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "none",
        random: true,
        straight: false,
        outModes: "out",
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        },
        path: {
          enable: true,
          options: {
            size: 50,
            draw: false,
            increment: 0.001
          }
        },
        trail: {
          enable: true,
          length: 10,
          fill: { color: "#ffffff" },
        }
      }
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: {
          enable: true,
          mode: ["grab", "bubble", "repulse"]
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
            opacity: 1,
            color: "#87CEEB"
          }
        },
        bubble: {
          distance: 200,
          size: 12,
          duration: 2,
          opacity: 0.8,
          speed: 3,
          color: "#1E90FF"
        },
        repulse: {
          distance: 100,
          duration: 0.4
        },
        push: {
          quantity: 4
        }
      }
    },
    retina_detect: true,
    background: {
      color: "transparent",
      image: "",
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover"
    }
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
      type: "Impromptu"
    },
    {
      id: "interp",
      title: "Interp",
      description: "Perform your own interpretation of a piece.",
      background: "linear-gradient(135deg, #6a11cb, #2575fc)",
      navigateTo: "/speech",
      icon: "🎭",
      type: "Interp",
      defaultTopic: "Choose a piece of literature, poem, or dramatic work to interpret"
    },
    {
      id: "original",
      title: "Original",
      description: "Craft and present original content.",
      background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
      navigateTo: "/speech",
      icon: "✏️",
      type: "Original",
      defaultTopic: "Present your original speech on a topic of your choice"
    },
    {
      id: "extemp",
      title: "Extemp",
      description: "Speak on current events with depth.",
      background: "linear-gradient(135deg, #00c853, #00e676)",
      navigateTo: "/beta",
      icon: "🌎",
      type: "Extemp"
    },
  ];

  return (
    <div style={styles.container} ref={containerRef}>
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particlesOptions}
        style={{ opacity: 0 }}
      />

      {/* Parallax Background Layers */}
      <motion.div
        style={{
          ...styles.parallaxLayer,
          y: y1,
          backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
          opacity: 1,
          mixBlendMode: "normal"
        }}
      />
      <motion.div
        style={{
          ...styles.parallaxLayer,
          y: y2,
          backgroundImage: "url('https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
          opacity: 1,
          mixBlendMode: "normal"
        }}
      />
      <motion.div
        style={{
          ...styles.parallaxLayer,
          y: y3,
          backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
          opacity: 1,
          mixBlendMode: "normal"
        }}
      />

      <Header onFeedbackClick={handleFeedbackClick} />

      {/* Welcome Screen */}
      <motion.div 
        style={styles.welcomeScreen}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }}
      >
        <motion.h1
          style={styles.heading}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <TypeWriter text="Welcome to Speech App" delay={100} />
          {userName && (
            <motion.span
              style={{ 
                display: "inline-block", 
                marginLeft: "10px",
                background: "linear-gradient(45deg, #fff, #87CEEB, #1E90FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              , {userName}
            </motion.span>
          )}
        </motion.h1>

        <motion.div 
          style={styles.navDots}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              style={styles.navDot}
              whileHover={{ 
                scale: 1.5, 
                backgroundColor: "#fff",
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.8)"
              }}
              onClick={() => scrollToSection(section.id)}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              whileTap={{ scale: 0.9 }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.1}
            />
          ))}
        </motion.div>

        <motion.div
          style={styles.downArrow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0.4, 1, 0.4],
            y: [0, 10, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{
            scale: 1.2,
            rotate: [0, -10, 10, -10, 0],
            transition: { duration: 0.5 }
          }}
          onClick={() => scrollToSection(sections[0].id)}
        >
          <FiArrowDown size={52.5} />
        </motion.div>
      </motion.div>

      {/* Full-page sections */}
      {sections.map((section, index) => (
        <motion.div
          key={section.id}
          id={section.id}
          style={{ ...styles.fullPageSection, background: section.background }}
          initial={{ opacity: 0 }}
          whileInView={{ 
            opacity: 1,
            transition: {
              duration: 0.8,
              staggerChildren: 0.2
            }
          }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <motion.div 
            style={styles.sectionContent}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div style={styles.sectionHeader}>
              <motion.div
                style={styles.sectionIcon}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                whileHover={{
                  scale: 1.2,
                  rotate: 360,
                  transition: { duration: 0.5 }
                }}
                transition={{ 
                  duration: 0.6,
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200
                }}
              >
                {section.icon}
              </motion.div>
              <motion.h2
                style={styles.sectionTitle}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{
                  scale: 1.05,
                  textShadow: "0 0 15px rgba(255,255,255,0.8)",
                  transition: { duration: 0.3 }
                }}
                transition={{ 
                  duration: 0.6,
                  delay: 0.4,
                  type: "spring",
                  stiffness: 100
                }}
              >
                {section.title}
              </motion.h2>
            </div>
            <motion.p
              style={styles.sectionDescription}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {section.description}
            </motion.p>
            <motion.button
              style={styles.ctaButton}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                delay: 0.6,
                type: "spring",
                stiffness: 200
              }}
              onClick={() => navigate(section.navigateTo, { 
                state: { 
                  topicName: section.defaultTopic || null,
                  type: section.type 
                }
              })}
            >
              <motion.span
                animate={{ 
                  x: [0, 5, 0],
                  textShadow: [
                    "0 0 5px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(255,255,255,0.8)",
                    "0 0 5px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                Begin Journey
              </motion.span>
              <motion.span 
                style={styles.buttonArrow}
                animate={{ 
                  x: [0, 8, 0],
                  opacity: [1, 0.6, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>
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
    width: "100%",
    color: "#fff",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    overflow: "auto",
    WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
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
    padding: "clamp(0.5rem, 2vw, 2rem)",
    background: "rgba(30, 60, 114, 0.95)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 4000,
    borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
    '@media (max-width: 768px)': {
      padding: "0.8rem 1rem",
      justifyContent: "flex-end"
    }
  },
  headerTitle: {
    fontSize: "clamp(1.2rem, 5vw, 2rem)",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
    letterSpacing: "2px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    background: "linear-gradient(45deg, #fff, #87CEEB)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "glow 2s ease-in-out infinite alternate",
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  settingsContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    marginRight: "4rem",
    marginLeft: "auto",
    zIndex: 5000,
  },
  settingsIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.8rem",
    cursor: "pointer",
    filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))",
    transition: "all 0.3s ease",
  },
  settingsDropdown: {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    padding: "1rem",
    width: "200px",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
  },
  userName: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#333",
    padding: "0.5rem",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    marginBottom: "0.5rem",
  },
  dropdownButton: {
    padding: "0.5rem 1rem",
    fontSize: "0.9rem",
    fontWeight: "500",
    width: "100%",
    border: "none",
    borderRadius: "8px",
    background: "rgba(255, 255, 255, 0.1)",
    color: "#333",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(0, 0, 0, 0.05)",
    },
  },
  welcomeScreen: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    padding: "clamp(1rem, 5vw, 3rem)",
    textAlign: "center",
    position: "relative",
    marginTop: "clamp(60px, 10vh, 80px)",
    '@media (max-width: 768px)': {
      marginTop: "60px",
      padding: "1rem",
    },
  },
  heading: {
    fontSize: "clamp(2rem, 8vw, 3.5rem)",
    fontWeight: "700",
    marginBottom: "1rem",
    letterSpacing: "2px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    background: "linear-gradient(45deg, #fff, #87CEEB, #1E90FF)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "gradientText 3s ease infinite",
  },
  navDots: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    padding: "1rem",
    borderRadius: "20px",
  },
  navDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
    "&:hover": {
      backgroundColor: "#fff",
      transform: "scale(1.2)",
      border: "2px solid rgba(255, 255, 255, 0.5)",
    }
  },
  downArrow: {
    fontSize: "3rem",
    marginTop: "2rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: "#fff",
    animation: "bounce 4s infinite ease-in-out",
    filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.7))",
    "&:hover": {
      transform: "scale(1.2)",
    }
  },
  "@keyframes bounce": {
    "0%": {
      transform: "translateY(0)",
    },
    "20%": {
      transform: "translateY(-80px)",
    },
    "30%": {
      transform: "translateY(-40px)",
    },
    "40%": {
      transform: "translateY(-100px)",
    },
    "50%": {
      transform: "translateY(-60px)",
    },
    "60%": {
      transform: "translateY(-90px)",
    },
    "70%": {
      transform: "translateY(-30px)",
    },
    "80%": {
      transform: "translateY(-70px)",
    },
    "90%": {
      transform: "translateY(-20px)",
    },
    "100%": {
      transform: "translateY(0)",
    }
  },
  "@keyframes gradientText": {
    "0%": {
      backgroundPosition: "0% 50%",
      backgroundSize: "200% 200%",
    },
    "50%": {
      backgroundPosition: "100% 50%",
      backgroundSize: "200% 200%",
    },
    "100%": {
      backgroundPosition: "0% 50%",
      backgroundSize: "200% 200%",
    }
  },
  "@keyframes glow": {
    "from": {
      textShadow: "0 0 10px #fff, 0 0 20px #87CEEB, 0 0 30px #1E90FF",
    },
    "to": {
      textShadow: "0 0 20px #fff, 0 0 30px #87CEEB, 0 0 40px #1E90FF",
    }
  },
  fullPageSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    padding: "clamp(1rem, 5vw, 3rem)",
    textAlign: "center",
    position: "relative",
    transition: "transform 0.3s ease",
    '@media (hover: hover)': {
      "&:hover": {
        transform: "scale(1.02)",
      },
    },
    '@media (max-width: 768px)': {
      padding: "2rem 1rem",
      minHeight: "auto",
      marginBottom: "2rem",
    },
  },
  sectionContent: {
    maxWidth: "min(800px, 90%)",
    width: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "clamp(10px, 2vw, 20px)",
    padding: "clamp(1rem, 4vw, 2rem)",
    '@media (max-width: 768px)': {
      width: "95%",
      padding: "1.5rem",
    },
  },
  sectionHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-10px",
      width: "50%",
      height: "2px",
      background: "linear-gradient(90deg, transparent, #fff, transparent)",
    }
  },
  sectionIcon: {
    fontSize: "clamp(2.5rem, 8vw, 4rem)",
    marginBottom: "clamp(0.5rem, 2vw, 1rem)",
    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
    display: "inline-block",
  },
  sectionTitle: {
    fontSize: "clamp(1.2rem, 5vw, 3rem)",
    fontWeight: "700",
    marginBottom: "clamp(0.5rem, 2vw, 1rem)",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    background: "linear-gradient(45deg, #fff, #87CEEB)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  sectionDescription: {
    fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
    maxWidth: "100%",
    lineHeight: "1.6",
    marginBottom: "clamp(1rem, 3vw, 1.5rem)",
    padding: "0 clamp(0.5rem, 2vw, 1rem)",
  },
  ctaButton: {
    padding: "clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)",
    fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
    fontWeight: "600",
    width: "fit-content",
    minWidth: "150px",
    border: "none",
    borderRadius: "clamp(8px, 2vw, 15px)",
    background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(5px)",
    border: "1px solid rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    margin: "0 auto",
    position: "relative",
    overflow: "hidden",
    '@media (hover: hover)': {
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
      },
    },
    '@media (max-width: 768px)': {
      width: "100%",
      maxWidth: "300px",
    },
  },
  buttonArrow: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    filter: "drop-shadow(0 0 5px rgba(255,255,255,0.5))",
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
    borderRadius: "clamp(8px, 2vw, 12px)",
    padding: "clamp(1rem, 4vw, 1.5rem)",
    width: "min(90%, 450px)",
    margin: "1rem",
    textAlign: "center",
    boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    '@media (max-width: 768px)': {
      width: "95%",
      margin: "0.5rem",
    },
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
    gap: "clamp(0.5rem, 2vw, 1rem)",
    flexWrap: "wrap",
    '@media (max-width: 768px)': {
      flexDirection: "column",
      gap: "0.5rem",
    },
  },
  modalButton: {
    padding: "clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)",
    fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
    minWidth: "120px",
    '@media (max-width: 768px)': {
      width: "100%",
    },
  },
  modalButtonCancel: {
    padding: "clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)",
    fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
    minWidth: "120px",
    '@media (max-width: 768px)': {
      width: "100%",
    },
  },
  '@media (hover: none)': {
    ctaButton: {
      "&:active": {
        transform: "scale(0.98)",
      },
    },
    navDot: {
      "&:active": {
        backgroundColor: "#fff",
        transform: "scale(1.2)",
      },
    },
  },
};

export default HomeScreen;