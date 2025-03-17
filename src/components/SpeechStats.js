import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { colors } from '../styles/theme';
import { FiClock, FiTrendingUp, FiRotateCcw, FiHome, FiTarget } from 'react-icons/fi';
import Particles from 'react-tsparticles';
import { useSpring, animated } from 'react-spring';

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
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
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

// Particles configuration
const particlesConfig = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: "#ffffff"
    },
    shape: {
      type: "circle"
    },
    opacity: {
      value: 0.5,
      random: true
    },
    size: {
      value: 3,
      random: true
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      }
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4
      }
    }
  }
};

// Main component
function SpeechStats() {
  const location = useLocation();
  const navigate = useNavigate();
  const { timeInSeconds, speechType } = location.state || {};
  const grade = calculateGrade(timeInSeconds, speechType);
  const [showStats, setShowStats] = useState(false);

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

  // Spring animation for stats details
  const props = useSpring({ opacity: showStats ? 1 : 0, transform: showStats ? 'translateY(0)' : 'translateY(20px)', config: { tension: 200, friction: 20 } });

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

      <motion.div style={styles.content} variants={containerVariants}>
        <motion.div style={styles.header} variants={itemVariants}>
          <motion.h1
            style={styles.heading}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            Speech Performance
          </motion.h1>
          <motion.p
            style={styles.speechType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {speechType} Speech
          </motion.p>
        </motion.div>

        <AnimatePresence>
          {showStats && (
            <animated.div style={{ ...props, ...styles.statsContainer }} variants={containerVariants}>
              <motion.div style={styles.gradeCard} variants={cardVariants}>
                <motion.div style={styles.gradeCircle}>
                  <svg width="150" height="150" viewBox="0 0 100 100">
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke={grade.color}
                      strokeWidth="8"
                      fill="none"
                      variants={circleVariants}
                      style={{
                        strokeDasharray: "283",
                        strokeDashoffset: 283 * (1 - grade.score / 100)
                      }}
                    />
                  </svg>
                  <motion.div
                    style={styles.gradeContent}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                  >
                    <h2 style={{ ...styles.grade, color: grade.color }}>{grade.letter}</h2>
                    <p style={styles.score}>{grade.score.toFixed(1)}%</p>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div style={styles.statsDetails} variants={containerVariants}>
                <motion.div style={styles.statCard} variants={cardVariants}>
                  <FiClock size={28} color={colors.accent.blue} />
                  <h3>Time Taken</h3>
                  <p style={styles.statValue}>{formatTime(timeInSeconds)}</p>
                </motion.div>

                <motion.div style={styles.statCard} variants={cardVariants}>
                  <FiTarget size={28} color={colors.accent.green} />
                  <h3>Target Time</h3>
                  <p style={styles.statValue}>
                    {formatTime(timeRequirements[speechType]?.ideal || 120)}
                  </p>
                </motion.div>
              </motion.div>

              <motion.div style={{ ...styles.statCard, gridColumn: "1 / -1" }} variants={cardVariants}>
                <FiTrendingUp size={28} color={grade.color} />
                <h3>Feedback</h3>
                <p style={styles.feedback}>{grade.feedback}</p>
              </motion.div>

              <motion.div style={styles.buttonContainer} variants={itemVariants}>
                <motion.button
                  style={{ ...styles.button, background: colors.accent.blue }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/')}
                >
                  <FiHome size={20} />
                  <span>Back to Home</span>
                </motion.button>

                <motion.button
                  style={{ ...styles.button, background: colors.accent.green }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(-1)}
                >
                  <FiRotateCcw size={20} />
                  <span>Try Again</span>
                </motion.button>
              </motion.div>
            </animated.div>
          )}
        </AnimatePresence>
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
    background: colors.background.main,
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
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
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  heading: {
    fontSize: '3rem',
    fontWeight: '700',
    background: `linear-gradient(135deg, ${colors.text.primary}, ${colors.accent.blue})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
  },
  speechType: {
    fontSize: '1.2rem',
    color: colors.text.secondary,
    opacity: 0.8,
  },
  statsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  gradeCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  gradeCircle: {
    position: 'relative',
    width: '150px',
    height: '150px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeContent: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  grade: {
    fontSize: '4rem',
    fontWeight: '700',
    margin: 0,
  },
  score: {
    fontSize: '1.2rem',
    color: colors.text.secondary,
    margin: 0,
  },
  statsDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    width: '100%',
  },
  statCard: {
    background: 'rgba(42, 82, 152, 0.95)',
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
    marginTop: '2rem',
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
  },
};

export default SpeechStats;