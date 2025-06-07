import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiMic, FiAlertCircle } from 'react-icons/fi';
import Particles from 'react-tsparticles';
import { colors, componentStyles, particlesConfig } from '../styles/theme';

const NotFound = () => {
  const navigate = useNavigate();

  // Cool animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Floating microphone effect
  const glowVariants = {
    animate: {
      boxShadow: [
        '0 0 5px rgba(100, 180, 255, 0.3)',
        '0 0 20px rgba(100, 180, 255, 0.7)',
        '0 0 5px rgba(100, 180, 255, 0.3)',
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Speech-related jokes for 404 page
  const getRandomJoke = () => {
    const jokes = [
      "This page is like that speaker who forgot their entire speech... non-existent.",
      "404: Your request was so boring, the server fell asleep mid-sentence.",
      "You've found the page where all forgotten speech notes go. Unfortunately, they're still lost.",
      "If this page were a speech, it would be 10 minutes of awkward silence and throat clearing.",
      "Page not found: much like your confidence when you realize your fly was open during your entire presentation.",
      "Your navigation skills are like a speech without preparation — all over the place and leading nowhere."
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  };

  return (
    <motion.div
      style={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="not-found-page"
    >
      <Particles
        id="tsparticles"
        options={{
          ...particlesConfig,
          particles: {
            ...particlesConfig.particles,
            number: {
              ...particlesConfig.particles.number,
              value: 100 // More stars for 404 page
            }
          }
        }}
      />

      <motion.div style={styles.content}>
        <motion.div 
          style={styles.errorContainer}
          variants={itemVariants}
        >
          <motion.div 
            style={styles.iconContainer}
            variants={floatVariants}
            animate="animate"
          >
            <motion.div
              style={styles.glowCircle}
              variants={glowVariants}
              animate="animate"
            />
            <FiMic size={80} color={colors.accent.blue} />
          </motion.div>
          
          <motion.h1 style={styles.errorCode}>404</motion.h1>
          <motion.h2 style={styles.errorTitle}>Speech Interrupted!</motion.h2>
          <motion.p style={styles.errorMessage}>
            The page you're looking for is lost like a speaker who forgot their lines.
          </motion.p>
          
          <motion.div 
            style={styles.quoteBox}
            variants={itemVariants}
          >
            <p style={styles.quote}>"{getRandomJoke()}"</p>
          </motion.div>
        </motion.div>

        <motion.div 
          style={styles.buttonsContainer}
          variants={itemVariants}
        >
          <motion.button
            style={styles.homeButton}
            whileHover={{ scale: 1.05, backgroundColor: colors.accent.blue }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/home')}
          >
            <FiHome size={20} />
            <span>Return to the Podium</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  container: {
    ...componentStyles.container,
    overflow: 'hidden',
    position: 'relative'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    height: '100vh',
    width: '100%',
    zIndex: 10,
    position: 'relative'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '3rem 2rem',
    borderRadius: '20px',
    background: 'rgba(20, 40, 80, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(100, 180, 255, 0.3)',
    boxShadow: '0 10px 30px rgba(10, 20, 40, 0.5)',
    maxWidth: '600px',
    width: '90%'
  },
  iconContainer: {
    position: 'relative',
    marginBottom: '1.5rem'
  },
  glowCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'rgba(100, 180, 255, 0.1)',
    boxShadow: '0 0 15px rgba(100, 180, 255, 0.5)'
  },
  errorCode: {
    fontSize: 'clamp(5rem, 15vw, 10rem)',
    fontWeight: '800',
    margin: '0',
    color: colors.text.primary,
    textShadow: '0 0 15px rgba(100, 180, 255, 0.7)',
    background: `linear-gradient(45deg, ${colors.accent.blue}, ${colors.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  errorTitle: {
    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
    fontWeight: '600',
    margin: '0.5rem 0 1.5rem',
    color: colors.text.primary
  },
  errorMessage: {
    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    color: colors.text.secondary,
    margin: '0 0 2rem',
    lineHeight: 1.6
  },
  quoteBox: {
    padding: '1rem',
    background: 'rgba(100, 180, 255, 0.1)',
    borderRadius: '10px',
    border: '1px solid rgba(100, 180, 255, 0.2)',
    marginTop: '1rem'
  },
  quote: {
    fontStyle: 'italic',
    margin: 0,
    color: colors.text.secondary,
    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
  },
  buttonsContainer: {
    display: 'flex',
    marginTop: '2.5rem'
  },
  homeButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '1rem 2rem',
    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    fontWeight: '600',
    color: colors.text.primary,
    background: colors.primary.main,
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease'
  }
};

export default NotFound; 