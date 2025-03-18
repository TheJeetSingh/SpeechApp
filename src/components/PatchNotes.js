import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated } from "react-spring";
import Particles from "react-tsparticles";
import { loadFirePreset } from "tsparticles-preset-fire";
import { loadSnowPreset } from "tsparticles-preset-snow";
import { Reveal, Fade } from "react-awesome-reveal";
import { keyframes } from "@emotion/react";

// Patch notes data - this can be updated for each release
export const patchNotesData = {
  version: "1.0.0",
  date: "March 17, 2025",
  changes: [
    {
      title: "What's New?",
      items: [
        "Hey Speechers, this is officially the first patch note for the site.",
        "Added dedicated patch notes system with stunning animated interface",
        "Enhanced audio visualization with more vibrant colors",
        "Integrated black hole transition effect when returning to home screen from speech stats",
        "And don't forget to tell your friends!"
      ]
    },
    {
      title: "Improvements",
      items: [
        "Enhanced audience animation with consistent hat colors",
        "Simplified PDF download functionality in speech statistics",
        "Removed JSON download option for a cleaner interface",
        "Improved overall visual consistency across the application"
      ]
    },
    {
      title: "Coming Soon",
      items: [
        "Advanced speech recognition features",
        "Enhanced timer mechanics",
        "More interactive audience animations",
        "Additional practice modes for different speech types"
      ]
    }
  ]
};

// Custom animations
const glowPulse = keyframes`
  0% { box-shadow: 0 0 10px rgba(0, 191, 255, 0.3); }
  50% { box-shadow: 0 0 30px rgba(0, 191, 255, 0.7); }
  100% { box-shadow: 0 0 10px rgba(0, 191, 255, 0.3); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styles for the PatchNotes component
const styles = {
  patchNotesOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
    backdropFilter: "blur(10px)",
  },
  patchNotesContent: {
    width: "90%",
    maxWidth: "700px",
    maxHeight: "80vh",
    backgroundColor: "rgba(20, 30, 60, 0.85)",
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 191, 255, 0.4)",
    overflowY: "auto",
    color: "#fff",
    position: "relative",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(0, 191, 255, 0.5) rgba(20, 30, 60, 0.5)",
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(20, 30, 60, 0.5)",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(0, 191, 255, 0.5)",
      borderRadius: "10px",
    },
    backdropFilter: "blur(5px)",
  },
  contentGlow: {
    position: "absolute",
    inset: 0,
    borderRadius: "16px",
    opacity: 0.4,
    zIndex: -1,
    background: "radial-gradient(circle at center, rgba(0, 191, 255, 0.5) 0%, rgba(30, 60, 114, 0) 70%)",
  },
  patchNotesHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "2rem",
    position: "relative",
  },
  patchNotesTitle: {
    color: "#fff",
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    textAlign: "center",
    position: "relative",
    textShadow: "0 0 15px rgba(0, 191, 255, 0.8)",
  },
  titleUnderline: {
    position: "absolute",
    bottom: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    height: "3px",
    width: "70%",
    background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(0, 191, 255, 1), rgba(255,255,255,0))",
    borderRadius: "3px",
    backgroundSize: "200% 200%",
  },
  patchNotesVersion: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#00BFFF",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: "0.3rem 0.8rem",
    borderRadius: "20px",
    boxShadow: "0 0 10px rgba(0, 191, 255, 0.5)",
  },
  patchNotesDate: {
    fontSize: "1rem",
    color: "#b8d4ff",
    marginTop: "1rem",
    fontWeight: "500",
    padding: "0.3rem 1rem",
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    backdropFilter: "blur(5px)",
  },
  patchNotesList: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  patchNotesSection: {
    marginBottom: "1rem",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
  },
  sectionGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "60%",
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",
    zIndex: 0,
  },
  patchNotesSectionTitle: {
    color: "#00BFFF",
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "1rem",
    position: "relative",
    display: "inline-block",
    zIndex: 1,
    textShadow: "0 0 10px rgba(0, 191, 255, 0.5)",
    backgroundImage: "linear-gradient(90deg, #00BFFF, #87CEFA, #00BFFF)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  patchNotesItems: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    zIndex: 1,
    position: "relative",
  },
  patchNotesItem: {
    position: "relative",
    paddingLeft: "2rem",
    marginBottom: "1rem",
    fontSize: "1rem",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    zIndex: 1,
    transition: "all 0.2s ease",
  },
  itemCircle: {
    position: "absolute",
    left: 0,
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#00BFFF",
    boxShadow: "0 0 10px rgba(0, 191, 255, 0.8)",
  },
  patchNotesCloseButton: {
    padding: "0.7rem 2rem",
    backgroundColor: "rgba(0, 191, 255, 0.8)",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "2rem",
    alignSelf: "center",
    display: "block",
    margin: "2rem auto 0",
    boxShadow: "0 0 20px rgba(0, 191, 255, 0.5)",
    position: "relative",
    overflow: "hidden",
  },
  buttonGlow: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%)",
    opacity: 0,
  },
  particlesContainer: {
    position: "absolute",
    inset: 0,
    zIndex: -1,
  },
};

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      when: "beforeChildren"
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.5, 
      delay: 0.2,
      when: "afterChildren"
    }
  }
};

const contentVariants = {
  hidden: { 
    scale: 0.8, 
    opacity: 0,
    y: 50,
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    y: 0,
    transition: { 
      type: "spring",
      damping: 20,
      stiffness: 100,
      duration: 0.7,
      delay: 0.2
    }
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    y: -50,
    transition: { 
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      damping: 12,
      stiffness: 100,
      duration: 0.7,
      delay: 0.5
    }
  }
};

const dateVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring",
      damping: 15,
      stiffness: 80,
      duration: 0.7,
      delay: 0.7
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: i => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      damping: 15,
      stiffness: 80,
      delay: 0.9 + (i * 0.2)
    }
  })
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: i => ({ 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring",
      damping: 12,
      delay: i * 0.1
    }
  })
};

// PatchNotes component
function PatchNotes({ isVisible, onClose, patchNotes = patchNotesData }) {
  const [buttonHover, setButtonHover] = useState(false);
  const [particlesInitialized, setParticlesInitialized] = useState(false);

  // React Spring animations
  const versionSpring = useSpring({
    loop: true,
    from: { boxShadow: "0 0 10px rgba(0, 191, 255, 0.3)" },
    to: [
      { boxShadow: "0 0 25px rgba(0, 191, 255, 0.7)" },
      { boxShadow: "0 0 10px rgba(0, 191, 255, 0.3)" }
    ],
    config: { duration: 2000 }
  });

  const titleSpring = useSpring({
    loop: true,
    from: { textShadow: "0 0 10px rgba(0, 191, 255, 0.4)" },
    to: [
      { textShadow: "0 0 20px rgba(0, 191, 255, 0.8)" },
      { textShadow: "0 0 10px rgba(0, 191, 255, 0.4)" }
    ],
    config: { duration: 2500 }
  });

  const shimmerSpring = useSpring({
    loop: true,
    from: { backgroundPosition: "-200% 0" },
    to: { backgroundPosition: "200% 0" },
    config: { duration: 3000 }
  });

  // Particle initialization
  const particlesInit = async (engine) => {
    await loadFirePreset(engine);
    await loadSnowPreset(engine);
    setParticlesInitialized(true);
  };

  // Particle options
  const particleOptions = useMemo(() => ({
    preset: "snow",
    particles: {
      color: {
        value: ["#00BFFF", "#87CEFA", "#1E90FF", "#B0E0E6"],
      },
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 800
        }
      },
      opacity: {
        value: 0.5,
        random: true,
      },
      size: {
        value: 4,
        random: true,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "bottom",
        random: true,
        straight: false,
        outModes: {
          default: "out"
        }
      },
      shape: {
        type: "circle"
      }
    },
    background: {
      color: {
        value: "transparent"
      }
    }
  }), []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={styles.patchNotesOverlay}
          onClick={onClose}
        >
          {/* Particles Background */}
          <div style={styles.particlesContainer}>
            <Particles
              id="patch-notes-particles"
              init={particlesInit}
              options={particleOptions}
            />
          </div>
          
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={styles.patchNotesContent}
            onClick={e => e.stopPropagation()}
          >
            <Reveal keyframes={shimmerAnimation} delay={300} duration={3000} triggerOnce>
              <motion.div 
                style={styles.contentGlow}
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </Reveal>
            
            <div style={styles.patchNotesHeader}>
              <motion.h2 
                variants={titleVariants}
                initial="hidden"
                animate="visible"
                style={styles.patchNotesTitle}
              >
                <animated.div style={titleSpring}>
                  Patch Notes 
                </animated.div>
                <animated.span 
                  style={{
                    ...styles.patchNotesVersion,
                    ...versionSpring,
                  }}
                >
                  v{patchNotes.version}
                </animated.span>
              </motion.h2>
              
              <animated.div
                style={{
                  ...styles.titleUnderline,
                  ...shimmerSpring
                }}
              />
              
              <motion.div 
                variants={dateVariants}
                initial="hidden"
                animate="visible"
                style={styles.patchNotesDate}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  transition: { duration: 0.2 }
                }}
              >
                {patchNotes.date}
              </motion.div>
            </div>
            
            <motion.div style={styles.patchNotesList}>
              {patchNotes.changes.map((section, index) => (
                <Fade key={index} cascade damping={0.1} direction="up" triggerOnce>
                  <motion.div 
                    style={styles.patchNotesSection}
                    custom={index}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
                      transition: { duration: 0.3 }
                    }}
                  >
                    <motion.div 
                      style={styles.sectionGlow}
                      animate={{
                        opacity: [0.1, 0.3, 0.1],
                        y: [0, 5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3
                      }}
                    />
                    
                    <animated.h3 
                      style={{
                        ...styles.patchNotesSectionTitle,
                        ...shimmerSpring
                      }}
                    >
                      {section.title}
                    </animated.h3>
                    
                    <ul style={styles.patchNotesItems}>
                      {section.items.map((item, i) => (
                        <Reveal key={i} keyframes={floatAnimation} delay={i * 100} duration={3000} triggerOnce>
                          <motion.li 
                            style={styles.patchNotesItem}
                            custom={i}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{
                              x: 5,
                              color: "#00BFFF",
                              textShadow: "0 0 8px rgba(0, 191, 255, 0.7)",
                              transition: { duration: 0.2 }
                            }}
                          >
                            <motion.div 
                              style={styles.itemCircle}
                              animate={{ 
                                scale: [1, 1.5, 1],
                                boxShadow: [
                                  "0 0 10px rgba(0, 191, 255, 0.3)", 
                                  "0 0 15px rgba(0, 191, 255, 0.7)", 
                                  "0 0 10px rgba(0, 191, 255, 0.3)"
                                ]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.2
                              }}
                            />
                            {item}
                          </motion.li>
                        </Reveal>
                      ))}
                    </ul>
                  </motion.div>
                </Fade>
              ))}
            </motion.div>
            
            <Reveal keyframes={glowPulse} delay={500} duration={2000}>
              <motion.button
                style={styles.patchNotesCloseButton}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(0, 191, 255, 0.7)",
                  transition: { duration: 0.3 }
                }}
                whileTap={{ 
                  scale: 0.95,
                  rotate: [-1, 1, 0],
                  transition: { duration: 0.2 }
                }}
                onClick={onClose}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  transition: { 
                    type: "spring",
                    damping: 12,
                    stiffness: 100,
                    delay: 1.5 
                  }
                }}
                onHoverStart={() => setButtonHover(true)}
                onHoverEnd={() => setButtonHover(false)}
              >
                <motion.span
                  animate={{
                    scale: buttonHover ? [1, 1.03, 1] : 1,
                    transition: {
                      duration: 0.5,
                      repeat: buttonHover ? Infinity : 0,
                      ease: "easeInOut"
                    }
                  }}
                >
                  Close
                </motion.span>
                <motion.div 
                  style={styles.buttonGlow}
                  animate={{
                    opacity: buttonHover ? [0, 0.5, 0] : 0,
                    scale: buttonHover ? [0.5, 1.5, 0.5] : 0.5,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: buttonHover ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
              </motion.button>
            </Reveal>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PatchNotes; 