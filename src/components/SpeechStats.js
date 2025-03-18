import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { colors, animations, particlesConfig } from '../styles/theme';
import { FiClock, FiAward, FiRotateCcw, FiHome, FiTarget, FiArrowRight, FiDownload } from 'react-icons/fi';
import Particles from 'react-tsparticles';
import { useSpring, animated, config } from 'react-spring';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Define timeRequirements globally
const timeRequirements = {
  Impromptu: {
    ideal: 300, // 5 minutes
    min: 150,   // 2.5 minutes
    max: 330    // 5.5 minutes
  },
  Interp: {
    ideal: 600, // 10 minutes
    min: 540,   // 9 minutes
    max: 660    // 11 minutes
  },
  Original: {
    ideal: 600, // 10 minutes
    min: 540,   // 9 minutes
    max: 660    // 11 minutes
  },
  Extemp: {
    ideal: 420, // 7 minutes
    min: 360,   // 6 minutes
    max: 480    // 8 minutes
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      delay: i * 0.2
    }
  })
};

const circleVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 2,
      ease: "easeInOut"
    }
  }
};

const textRevealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Calculate grade based on time and speech type
function calculateGrade(timeInSeconds, speechType) {
  const requirements = timeRequirements[speechType] || timeRequirements.Impromptu;
  const { ideal, min, max } = requirements;

  // Calculate how close the time is to ideal
  const timeDiff = Math.abs(timeInSeconds - ideal);
  const maxDiff = Math.max(ideal - min, max - ideal);

  // Calculate score out of 100
  let score = 100 - (timeDiff / maxDiff) * 50;
  score = Math.max(0, Math.min(100, score)); // Clamp between 0 and 100

  // Convert numerical score to letter grade and color
  if (score >= 90) return { letter: 'A', score, feedback: 'Outstanding timing! You nailed it! 🌟', color: colors.accent.green };
  if (score >= 80) return { letter: 'B', score, feedback: 'Great job! Just a bit more precision and you\'ll be perfect! ✨', color: '#4CAF50' };
  if (score >= 70) return { letter: 'C', score, feedback: 'Good effort! Keep practicing to improve your timing. 💪', color: '#FFC107' };
  if (score >= 60) return { letter: 'D', score, feedback: 'You\'re getting there! Focus on hitting those time targets. 🎯', color: '#FF9800' };
  return { letter: 'F', score, feedback: 'Keep practicing! You\'ll get better with time. 🌱', color: colors.accent.red };
}

// Main component
function SpeechStats() {
  const location = useLocation();
  const navigate = useNavigate();
  const { timeInSeconds, speechType, topic } = location.state || {};
  const grade = calculateGrade(timeInSeconds, speechType);
  const [showStats, setShowStats] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isBlackHoleActive, setIsBlackHoleActive] = useState(false);
  const [pixelGridVisible, setPixelGridVisible] = useState(false);
  const statsRef = useRef(null);
  const blackHoleRef = useRef(null);
  const pixelsRef = useRef([]);

  // Generate random pixels for the disintegration effect
  useEffect(() => {
    if (pixelGridVisible) {
      // Create random pixels that will fall into the black hole
      const numPixels = 400; // Increased number of pixels
      const pixelData = [];
      
      // Create pixels in a grid-like pattern across the entire screen
      for (let i = 0; i < numPixels; i++) {
        pixelData.push({
          id: i,
          x: Math.random() * 100, // Random x position (0-100%)
          y: Math.random() * 100, // Random y position (0-100%)
          size: Math.random() * 15 + 3, // Random size between 3-18px
          delay: Math.random() * 0.8, // Reduced delay for faster animation
          duration: Math.random() * 1 + 1.5, // Faster duration between 1.5-2.5s
          color: Math.random() > 0.7 
            ? colors.accent.blue 
            : Math.random() > 0.5 
              ? colors.accent.purple 
              : '#ffffff', // More color variation
        });
      }
      
      pixelsRef.current = pixelData;
    }
  }, [pixelGridVisible]);

  useEffect(() => {
    // Trigger animation after component mount
    const timer = setTimeout(() => setShowStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Format time in minutes and seconds
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle step progression
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  // Spring animations
  const headingProps = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: config.gentle,
    delay: 300
  });

  // Motivational messages based on grade
  const getMotivationalMessage = () => {
    switch(grade.letter) {
      case 'A': return "Exceptional work! Your timing is spot-on!";
      case 'B': return "Impressive performance! Just a little fine-tuning needed!";
      case 'C': return "Solid effort! With practice, you'll hit those timing targets!";
      case 'D': return "Good try! Keep practicing your timing skills!";
      default: return "Every speech is a learning opportunity. Don't give up!";
    }
  };

  // Download as PDF
  const downloadAsPDF = async () => {
    if (!statsRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(statsRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#1e3c72'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`speech_stats_${speechType}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle black hole effect and navigation
  const handleHomeClick = () => {
    // First show the pixel grid
    setPixelGridVisible(true);
    
    // Then after a shorter delay, activate the black hole
    setTimeout(() => {
      setIsBlackHoleActive(true);
    }, 600); // Reduced delay before black hole appears
    
    // Navigate after the complete animation finishes
    setTimeout(() => {
      navigate('/');
    }, 3500); // Reduced delay to make the transition faster
  };

  return (
    <motion.div
      style={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Particles
        id="tsparticles"
        options={particlesConfig}
        style={styles.particles}
      />

      {/* Pixel Disintegration Effect */}
      <AnimatePresence>
        {pixelGridVisible && (
          <div style={styles.pixelContainer}>
            {pixelsRef.current.map((pixel) => {
              // Calculate center of the screen (in viewport units)
              const centerX = 50; // 50vw is center of viewport
              const centerY = 50; // 50vh is center of viewport
              
              // Calculate distance from current position to center
              const deltaX = centerX - pixel.x;
              const deltaY = centerY - pixel.y;
              
              return (
                <motion.div
                  key={pixel.id}
                  style={{
                    ...styles.pixel,
                    left: `${pixel.x}%`,
                    top: `${pixel.y}%`,
                    width: `${pixel.size}px`,
                    height: `${pixel.size}px`,
                    backgroundColor: pixel.color,
                  }}
                  initial={{ 
                    opacity: 0, 
                    scale: 0,
                  }}
                  animate={isBlackHoleActive ? { 
                    opacity: [1, 0.7, 0.3, 0],
                    x: `${deltaX}vw`, // Move exactly to center X
                    y: `${deltaY}vh`, // Move exactly to center Y
                    scale: [1, 0.8, 0.4, 0],
                    rotate: pixel.id % 2 === 0 ? 720 : -720,
                  } : { 
                    opacity: 1, 
                    scale: 1,
                    x: 0,
                    y: 0,
                    rotate: 0
                  }}
                  transition={isBlackHoleActive ? {
                    type: "tween",
                    duration: pixel.duration,
                    delay: pixel.delay,
                    ease: [0.64, 0.12, 0.34, 0.99], // Custom easing for a "sucking" effect
                  } : {
                    duration: 0.5,
                    delay: pixel.delay * 0.3
                  }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Black Hole Effect */}
      <AnimatePresence>
        {isBlackHoleActive && (
          <motion.div 
            ref={blackHoleRef}
            style={styles.blackHoleContainer}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 0.5, 2, 8, 20, 30],
              opacity: 1,
              rotate: 720,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              scale: { 
                duration: 2.8, // Faster scale animation
                times: [0, 0.15, 0.3, 0.5, 0.7, 1],
                ease: [0.16, 1, 0.3, 1] 
              },
              rotate: { duration: 2.8, ease: "linear" } // Faster rotation
            }}
          >
            <motion.div 
              style={styles.blackHole}
              animate={{ 
                rotate: 360,
                boxShadow: [
                  '0 0 20px 5px rgba(0, 0, 0, 0.6), inset 0 0 20px 5px rgba(0, 0, 0, 0.6)',
                  '0 0 40px 15px rgba(0, 0, 0, 0.7), inset 0 0 40px 15px rgba(0, 0, 0, 0.7)',
                  '0 0 60px 20px rgba(0, 0, 0, 0.8), inset 0 0 60px 20px rgba(0, 0, 0, 0.8)',
                  '0 0 80px 30px rgba(0, 0, 0, 0.9), inset 0 0 80px 30px rgba(0, 0, 0, 0.9)',
                  '0 0 100px 40px rgba(0, 0, 0, 1), inset 0 0 100px 40px rgba(0, 0, 0, 1)'
                ]
              }}
              transition={{
                rotate: { duration: 2.8, ease: "linear", repeat: Infinity }, // Faster rotation
                boxShadow: { duration: 2.8, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] } // Faster shadow transition
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        style={{
          ...styles.content,
          ...(pixelGridVisible && styles.contentBlur),
          ...(isBlackHoleActive && styles.contentSuckedIn)
        }}
        variants={containerVariants}
        animate={isBlackHoleActive ? {
          scale: 0,
          opacity: 0,
          filter: 'blur(10px)',
          transition: { duration: 1.2 }
        } : pixelGridVisible ? {
          scale: 0.95,
          filter: 'blur(3px)',
          transition: { duration: 0.5 }
        } : {}}
      >
        {/* Step 0: Initial Welcome Screen */}
        {currentStep === 0 && (
          <AnimatePresence>
            <motion.div 
              style={styles.welcomeContainer}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1 
                style={styles.welcomeHeading}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Speech Stats
          </motion.h1>
              
              <motion.div 
                className="welcome-decoration"
                style={styles.decoration}
                initial={{ width: 0 }}
                animate={{ width: '100px' }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
              
          <motion.p
                style={styles.welcomeSubtitle}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                Let's see how you did!
          </motion.p>
              
              <motion.button 
                style={styles.nextButton}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                onClick={nextStep}
              >
                <span>See Your Grade</span>
                <FiArrowRight size={20} />
              </motion.button>
        </motion.div>
          </AnimatePresence>
        )}

        {/* Step 1: Grade Screen */}
        {currentStep === 1 && (
        <AnimatePresence>
            <motion.div 
              style={styles.stepContainer}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2 
                style={styles.stepHeading}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Your Grade
              </motion.h2>
              
              <motion.div 
                style={styles.gradeCard}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 100, damping: 10 }}
              >
                <motion.div style={styles.gradeCircle}>
                  <motion.div 
                    className="circle-background"
                    style={{
                      ...styles.circleBackground,
                      background: `conic-gradient(${grade.color} ${grade.score}%, transparent ${grade.score}%, transparent 100%)`
                    }}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                  />
                  <svg width="150" height="150" viewBox="0 0 100 100">
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke={grade.color}
                      strokeWidth="8"
                      fill="none"
                      variants={circleVariants}
                      initial="hidden"
                      animate="visible"
                    />
                  </svg>
                  <motion.div
                    style={styles.gradeContent}
                    initial={{ scale: 0, rotateY: 180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ delay: 1, duration: 0.8, type: "spring" }}
                  >
                    <h2 style={{ ...styles.grade, color: grade.color }}>{grade.letter}</h2>
                    <p style={styles.score}>{grade.score.toFixed(1)}%</p>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.p 
                style={styles.motivationalMessage}
                variants={textRevealVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.5 }}
              >
                {getMotivationalMessage()}
              </motion.p>
              
              <motion.button 
                style={styles.nextButton}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
                onClick={nextStep}
              >
                <span>See Timing Details</span>
                <FiArrowRight size={20} />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Step 2: Time Details Screen */}
        {currentStep === 2 && (
          <AnimatePresence>
            <motion.div 
              ref={statsRef}
              style={styles.stepContainer}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2 
                style={styles.stepHeading}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Timing Details
              </motion.h2>
              
              <motion.div style={styles.statsDetails}>
                <motion.div 
                  style={styles.statCard}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <motion.div 
                    style={styles.iconWrapper}
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  >
                  <FiClock size={28} color={colors.accent.blue} />
                  </motion.div>
                  <h3>Your Time</h3>
                  <motion.p 
                    style={styles.statValue}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    {formatTime(timeInSeconds)}
                  </motion.p>
                </motion.div>

                <motion.div 
                  style={styles.statCard}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <motion.div 
                    style={styles.iconWrapper}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  >
                  <FiTarget size={28} color={colors.accent.green} />
                  </motion.div>
                  <h3>Target Time</h3>
                  <motion.p 
                    style={styles.statValue}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                  >
                    {formatTime(timeRequirements[speechType]?.ideal || 300)}
                  </motion.p>
                </motion.div>
              </motion.div>
              
              {topic && (
                <motion.div 
                  style={styles.topicCard}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <h3>Speech Topic</h3>
                  <p style={styles.topicText}>{topic}</p>
                </motion.div>
              )}
              
              <motion.div 
                style={styles.feedbackCard}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                <motion.div 
                  style={styles.iconWrapper}
                  animate={{ 
                    rotateY: [0, 180, 360],
                    scale: [1, 1.1, 1] 
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                >
                  <FiAward size={28} color={grade.color} />
                </motion.div>
                <h3>Feedback</h3>
                <motion.p 
                  style={styles.feedback}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  {grade.feedback}
                </motion.p>
              </motion.div>

              <motion.div 
                style={styles.downloadContainer}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.7, duration: 0.6 }}
              >
                <h3 style={styles.downloadHeading}>Save Your Results</h3>
                <motion.button
                  style={{ ...styles.downloadButton, background: colors.accent.purple }}
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadAsPDF}
                  disabled={isDownloading}
                >
                  <FiDownload size={20} />
                  <span>{isDownloading ? 'Generating...' : 'Save as PDF'}</span>
                </motion.button>
              </motion.div>

              <motion.div 
                style={styles.buttonContainer}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
              >
                <motion.button
                  style={{ ...styles.button, background: colors.accent.blue }}
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleHomeClick}
                >
                  <FiHome size={20} />
                  <span>Back to Home</span>
                </motion.button>

                <motion.button
                  style={{ ...styles.button, background: colors.accent.green }}
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(-1)}
                >
                  <FiRotateCcw size={20} />
                  <span>Try Again</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          )}
      </motion.div>
    </motion.div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: colors.primary.gradient,
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
    perspective: '1000px',
  },
  blackHoleContainer: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: '15px', // Slightly smaller starting point
    height: '15px',
    margin: '0',
    padding: '0',
    borderRadius: '50%',
    zIndex: 100,
    transform: 'translate(-50%, -50%)', // Ensures perfect centering
  },
  blackHole: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.9) 40%, rgba(0, 0, 0, 0.7) 100%)',
    boxShadow: '0 0 30px 10px rgba(0, 0, 0, 0.6), inset 0 0 30px 10px rgba(0, 0, 0, 0.6)',
  },
  contentSuckedIn: {
    transformOrigin: 'center center',
    transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  content: {
    width: '100%',
    maxWidth: '900px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    zIndex: 1,
    transform: 'translateZ(0)',
  },
  welcomeContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '4rem 2rem',
    background: colors.background.glass,
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  stepContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    background: colors.background.glass,
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  welcomeHeading: {
    fontSize: '4rem',
    fontWeight: '700',
    background: `linear-gradient(135deg, ${colors.text.primary}, ${colors.accent.blue})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1.5rem',
    textShadow: '0 10px 30px rgba(0,0,0,0.15)',
  },
  decoration: {
    height: '4px',
    background: colors.accent.blue,
    marginBottom: '1.5rem',
    borderRadius: '2px',
  },
  welcomeSubtitle: {
    fontSize: '1.5rem',
    color: colors.text.secondary,
    marginBottom: '3rem',
  },
  stepHeading: {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: `linear-gradient(135deg, ${colors.text.primary}, ${colors.accent.blue})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  nextButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: colors.text.primary,
    background: colors.accent.blue,
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  },
  gradeCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    transformStyle: 'preserve-3d',
    marginBottom: '2rem',
  },
  gradeCircle: {
    position: 'relative',
    width: '150px',
    height: '150px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    perspective: '1000px',
  },
  circleBackground: {
    position: 'absolute',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    transform: 'rotate(-90deg)',
  },
  gradeContent: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    transformStyle: 'preserve-3d',
  },
  grade: {
    fontSize: '4rem',
    fontWeight: '700',
    margin: 0,
    textShadow: '0 5px 15px rgba(0,0,0,0.2)',
  },
  score: {
    fontSize: '1.2rem',
    color: colors.text.secondary,
    margin: 0,
  },
  motivationalMessage: {
    fontSize: '1.4rem',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: '2.5rem',
    maxWidth: '70%',
  },
  statsDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    width: '100%',
    marginBottom: '1.5rem',
  },
  statCard: {
    background: 'rgba(42, 82, 152, 0.5)',
    padding: '2rem',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    color: colors.text.primary,
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    transformStyle: 'preserve-3d',
  },
  topicCard: {
    background: 'rgba(42, 82, 152, 0.5)',
    padding: '1.5rem',
    borderRadius: '20px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.8rem',
    color: colors.text.primary,
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  topicText: {
    fontSize: '1.2rem',
    fontStyle: 'italic',
    margin: 0,
  },
  feedbackCard: {
    background: 'rgba(42, 82, 152, 0.5)',
    padding: '2rem',
    borderRadius: '20px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    color: colors.text.primary,
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    marginBottom: '2rem',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: 0,
    background: `linear-gradient(135deg, ${colors.text.primary}, ${colors.accent.blue})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  feedback: {
    fontSize: '1.2rem',
    textAlign: 'center',
    margin: 0,
    lineHeight: 1.6,
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '1rem',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: colors.text.primary,
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  iconWrapper: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '0.75rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1rem',
    marginBottom: '1.5rem',
  },
  downloadHeading: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: colors.text.primary,
    margin: 0,
  },
  downloadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.8rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: colors.text.primary,
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  pixelContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 10,
    perspective: '1000px',
  },
  pixel: {
    position: 'absolute',
    borderRadius: '2px',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
    transformOrigin: 'center center',
    pointerEvents: 'none',
    zIndex: 15,
  },
  contentBlur: {
    filter: 'blur(3px)',
    transition: 'all 0.5s ease',
  },
};

export default SpeechStats;