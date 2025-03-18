import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { FiArrowDown } from "react-icons/fi";
import AudioReactiveBackground from "./AudioReactiveBackground";

// Wave Animation Background Component for fallback when audio permissions are denied
const WaveAnimationBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const waves = [];
    const colors = [
      '#1e3c72', '#2a5298', '#00BFFF', '#36D6E7', '#FF5E7D', '#7C4DFF'
    ];
    
    // Create multiple waves with different properties
    for (let i = 0; i < 6; i++) {
      waves.push({
        y: canvas.height * (0.2 + i * 0.12), // vertical position
        length: canvas.width * (1.2 - i * 0.1), // wavelength
        amplitude: 20 + i * 5, // wave height
        frequency: 0.003 - i * 0.0004, // how tight the waves are
        speed: 0.05 + i * 0.01, // wave movement speed
        color: colors[i % colors.length],
        offset: Math.random() * canvas.width // start at random position
      });
    }
    
    const drawWave = (wave, time) => {
      ctx.beginPath();
      ctx.moveTo(0, wave.y);
      
      // Draw the wave using a sine function
      for (let x = 0; x < canvas.width; x++) {
        const dx = x + wave.offset + time * wave.speed * 100;
        const y = wave.y + Math.sin(dx * wave.frequency) * wave.amplitude;
        ctx.lineTo(x, y);
      }
      
      // Complete the wave area to fill
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      
      // Add gradient fill
      const gradient = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, wave.y + wave.amplitude);
      gradient.addColorStop(0, wave.color + '40'); // More transparent at top
      gradient.addColorStop(1, wave.color + '90'); // More solid at bottom
      
      ctx.fillStyle = gradient;
      ctx.fill();
    };
    
    let animationId;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000; // time in seconds
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#f0f4ff');
      bgGradient.addColorStop(1, '#dae1f8');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw each wave
      waves.forEach(wave => drawWave(wave, elapsed));
      
      // Add floating particles
      for (let i = 0; i < 50; i++) {
        const x = (Math.sin(elapsed + i) + 1) * canvas.width / 2;
        const y = (Math.cos(elapsed * 0.7 + i * 0.3) + 1) * canvas.height / 2;
        // Ensure particle size is always positive
        const size = Math.max(1, Math.abs(Math.sin(elapsed + i * 0.5) * 3 + 2));
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = colors[i % colors.length] + '60';
        ctx.fill();
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Readjust wave positions after resize
      waves.forEach((wave, i) => {
        wave.y = canvas.height * (0.2 + i * 0.12);
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1 
      }} 
    />
  );
};

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
        color: "#000000",
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

// GlitchText component for a cyberpunk-style glitch effect
const GlitchText = ({ text }) => {
  return (
    <motion.div
      style={{
        position: "relative",
        display: "inline-block",
        color: "#000000",
        fontWeight: "bold",
      }}
    >
      <motion.span>{text}</motion.span>
      
      {/* Red glitch layer */}
      <motion.span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          color: "#ff0000",
          mixBlendMode: "multiply",
          opacity: 0.8,
        }}
        animate={{
          x: [0, -4, 5, -5, 0, 3, 0],
          opacity: [0, 0.8, 0, 0.8, 0, 0.8, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.span>
      
      {/* Blue glitch layer */}
      <motion.span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          color: "#00BFFF",
          mixBlendMode: "multiply",
          opacity: 0.8,
        }}
        animate={{
          x: [0, 4, -5, 5, 0, -3, 0],
          opacity: [0, 0.8, 0, 0.8, 0, 0.8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1],
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.span>
      
      {/* Distortion flicker */}
      <motion.span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          color: "#ffffff",
          textShadow: "2px 2px 0px #000000",
          clipPath: "inset(0 0 0 0)",
          opacity: 0,
        }}
        animate={{
          opacity: [0, 1, 0, 1, 0],
          clipPath: [
            "inset(0 0 0 0)",
            "inset(10% 0 0 0)",
            "inset(20% 0 30% 0)",
            "inset(0 0 10% 30%)",
            "inset(0 0 0 0)"
          ],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 3,
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

// FloatingText component with gentle floating animation for each character
const FloatingText = ({ text }) => {
  return (
    <motion.div style={{ display: "inline-block", color: "#000000" }}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          style={{ 
            display: "inline-block", 
            marginRight: char === " " ? "0.25em" : "0.05em",
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)"
          }}
          animate={{ 
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 2, 0, -2, 0],
            color: [
              "#000000", 
              index % 3 === 0 ? "#1e3c72" : index % 3 === 1 ? "#2a5298" : "#00BFFF", 
              "#000000"
            ]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            delay: index * 0.08,
            ease: "easeInOut" 
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
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

// Rules Display Component
const RulesDisplay = ({ isVisible, onClose, eventType }) => {
  const rulesContent = {
    Impromptu: {
      title: "Impromptu Rules",
      rules: [
        {
          title: "Time Limit",
          content: "You have 2 minutes to deliver your speech"
        },
        {
          title: "Preparation",
          content: "No preparation time - speak immediately after receiving your topic"
        },
        {
          title: "Structure",
          content: "Introduction, 2-3 main points, and conclusion recommended"
        },
        {
          title: "Topic Types",
          content: [
            "• Quotes - Interpret and discuss meaningful quotes",
            "• Abstract - Philosophical and conceptual topics",
            "• Concrete - Real-world subjects and scenarios",
            "• Current Events - Contemporary issues and news"
          ]
        },
        {
          title: "Scoring Criteria",
          content: [
            "• Content Development",
            "• Organization",
            "• Delivery",
            "• Language Use",
            "• Time Management"
          ]
        },
        {
          title: "Tips",
          content: [
            "• Stay calm and confident",
            "• Use personal experiences and examples",
            "• Maintain eye contact",
            "• Practice vocal variety",
            "• End with a strong conclusion"
          ]
        }
      ]
    },
    Interp: {
      title: "Interpretation Rules",
      rules: [
        {
          title: "Time Limit",
          content: "10 minutes maximum performance time"
        },
        {
          title: "Selection",
          content: "Choose from published prose, poetry, or dramatic literature"
        },
        {
          title: "Performance",
          content: "Develop character voices, gestures, and emotional connection"
        },
        {
          title: "Requirements",
          content: [
            "• Must use a published work",
            "• Clear distinction between characters",
            "• Maintain consistent character portrayal",
            "• Limited movement/gestures",
            "• No props or costumes allowed"
          ]
        },
        {
          title: "Scoring Criteria",
          content: [
            "• Character Development",
            "• Vocal Variety",
            "• Physical Presence",
            "• Interpretation Choices",
            "• Overall Impact"
          ]
        },
        {
          title: "Tips",
          content: [
            "• Choose material that resonates with you",
            "• Practice transitions between characters",
            "• Use varied vocal techniques",
            "• Connect with your audience",
            "• Tell the story authentically"
          ]
        }
      ]
    },
    Original: {
      title: "Original Speech Rules",
      rules: [
        {
          title: "Time Limit",
          content: "10 minutes maximum speech time"
        },
        {
          title: "Content",
          content: "Must be original content written by you"
        },
        {
          title: "Structure",
          content: "Clear introduction, body, and conclusion required"
        },
        {
          title: "Requirements",
          content: [
            "• Original research and writing",
            "• Proper citation of sources",
            "• Clear thesis statement",
            "• Supporting evidence",
            "• Persuasive argument"
          ]
        },
        {
          title: "Scoring Criteria",
          content: [
            "• Content Organization",
            "• Research Quality",
            "• Delivery Style",
            "• Persuasiveness",
            "• Overall Impact"
          ]
        },
        {
          title: "Tips",
          content: [
            "• Choose a passionate topic",
            "• Use credible sources",
            "• Practice delivery techniques",
            "• Engage your audience",
            "• End with a strong call to action"
          ]
        }
      ]
    },
    Extemp: {
      title: "Extemporaneous Rules",
      rules: [
        {
          title: "Time Limit",
          content: "7 minutes maximum speech time"
        },
        {
          title: "Preparation",
          content: "30 minutes prep time with access to research materials"
        },
        {
          title: "Structure",
          content: "Introduction, analysis points, and conclusion required"
        },
        {
          title: "Requirements",
          content: [
            "• Current events focus",
            "• Use of recent sources",
            "• Clear analysis",
            "• Supported arguments",
            "• Organized structure"
          ]
        },
        {
          title: "Scoring Criteria",
          content: [
            "• Analysis Depth",
            "• Source Usage",
            "• Organization",
            "• Delivery",
            "• Time Management"
          ]
        },
        {
          title: "Tips",
          content: [
            "• Stay updated on current events",
            "• Organize research effectively",
            "• Use specific examples",
            "• Practice time management",
            "• Develop clear analysis"
          ]
        }
      ]
    }
  };

  const currentRules = rulesContent[eventType];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={styles.rulesOverlay}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={styles.rulesContent}
            onClick={e => e.stopPropagation()}
          >
            <motion.h2 style={styles.rulesTitle}>{currentRules.title}</motion.h2>
            <motion.div style={styles.rulesList}>
              {currentRules.rules.map((rule, index) => (
                <motion.div 
                  key={index}
                  style={styles.ruleItem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3>{rule.title}</h3>
                  {Array.isArray(rule.content) ? (
                    rule.content.map((item, i) => (
                      <p key={i}>{item}</p>
                    ))
                  ) : (
                    <p>{rule.content}</p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// HomeScreen Component
function HomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [showRules, setShowRules] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [useAudioBackground, setUseAudioBackground] = useState(true);
  const [useWaveBackground, setUseWaveBackground] = useState(false);
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
      type: "Impromptu",
      onClick: () => {
        setSelectedEventType("Impromptu");
        setShowRules(true);
      }
    },
    {
      id: "interp",
      title: "Interp",
      description: "Perform your own interpretation of a piece.",
      background: "linear-gradient(135deg, #6a11cb, #2575fc)",
      navigateTo: "/speech",
      icon: "🎭",
      type: "Interp",
      defaultTopic: "Choose a piece of literature, poem, or dramatic work to interpret",
      onClick: () => {
        setSelectedEventType("Interp");
        setShowRules(true);
      }
    },
    {
      id: "original",
      title: "Original",
      description: "Craft and present original content.",
      background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
      navigateTo: "/speech",
      icon: "✏️",
      type: "Original",
      defaultTopic: "Present your original speech on a topic of your choice",
      onClick: () => {
        setSelectedEventType("Original");
        setShowRules(true);
      }
    },
    {
      id: "extemp",
      title: "Extemp",
      description: "Speak on current events with depth.",
      background: "linear-gradient(135deg, #00c853, #00e676)",
      navigateTo: "/beta",
      icon: "🌎",
      type: "Extemp",
      onClick: () => {
        setSelectedEventType("Extemp");
        setShowRules(true);
      }
    },
  ];

  // Toggle background type
  const toggleBackgroundType = () => {
    if (useAudioBackground) {
      setUseAudioBackground(false);
      setUseWaveBackground(true);
    } else {
      setUseWaveBackground(false);
      setUseAudioBackground(true);
    }
  };

  // Handle audio permission denial
  const handlePermissionDenied = () => {
    setUseAudioBackground(false);
    setUseWaveBackground(true);
  };

  return (
    <div style={styles.container} ref={containerRef}>
      {/* Background Selection Logic */}
      {useAudioBackground ? (
        <AudioReactiveBackground 
          colorMapping={{
            lowFreq: '#1e3c72',
            midFreq: '#2a5298',
            highFreq: '#00BFFF'
          }}
          onPermissionDenied={handlePermissionDenied}
        />
      ) : (
        <WaveAnimationBackground />
      )}

      <Header onFeedbackClick={handleFeedbackClick} />

      {/* Button to toggle background */}
      <motion.button
        style={styles.toggleButton}
        onClick={toggleBackgroundType}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Switch to {useAudioBackground ? "Wave" : "Audio"} Background
      </motion.button>

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
          <FloatingText text={userName ? `Welcome to Speech App, ${userName}` : "Welcome to Speech App"} />
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

      {/* Add RulesDisplay component */}
      <RulesDisplay 
        isVisible={showRules} 
        onClose={() => setShowRules(false)} 
        eventType={selectedEventType}
      />

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
          onClick={section.onClick}
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
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
    color: "#000000",
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
  card: {
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "2rem",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    transition: "all 0.3s ease",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  featureCard: {
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "2rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    textAlign: "center",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  testimonialCard: {
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "2rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    textAlign: "center",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  pricingCard: {
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "2rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    textAlign: "center",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
  rulesOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(30, 60, 114, 0.97)",
    zIndex: 5000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    overflow: "auto",
  },
  rulesContent: {
    width: "100%",
    maxWidth: "1000px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    padding: "2rem",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },
  rulesTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "2rem",
    textAlign: "center",
    background: "linear-gradient(45deg, #fff, #87CEEB)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  rulesList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
    padding: "1rem",
  },
  ruleItem: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "1.5rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    "& h3": {
      fontSize: "1.2rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "#87CEEB",
    },
    "& p": {
      fontSize: "1rem",
      lineHeight: "1.6",
      marginBottom: "0.5rem",
    },
  },
  toggleButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    background: 'rgba(30, 60, 114, 0.8)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 15px',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    backdropFilter: 'blur(5px)',
  },
};

export default HomeScreen;