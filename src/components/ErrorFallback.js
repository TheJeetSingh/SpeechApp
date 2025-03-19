import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import Particles from 'react-tsparticles';
import { colors, componentStyles, particlesConfig } from '../styles/theme';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  // Animation variants
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

  const glowVariants = {
    animate: {
      boxShadow: [
        '0 0 5px rgba(255, 100, 100, 0.3)',
        '0 0 20px rgba(255, 100, 100, 0.7)',
        '0 0 5px rgba(255, 100, 100, 0.3)',
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
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
        options={{
          ...particlesConfig,
          particles: {
            ...particlesConfig.particles,
            number: {
              ...particlesConfig.particles.number,
              value: 50
            },
            color: {
              value: ["#FF6B6B", "#FFE66D", "#F7FFF7"]
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
            <FiAlertTriangle size={80} color={colors.accent.red} />
          </motion.div>
          
          <motion.h1 style={styles.errorTitle}>Houston, we have a problem!</motion.h1>
          <motion.p style={styles.errorMessage}>
            An unexpected error has occurred in our mission systems.
          </motion.p>
          
          <motion.div 
            style={styles.errorDetails}
            variants={itemVariants}
          >
            <p style={styles.errorText}>
              {error?.message || "Unknown error occurred"}
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          style={styles.buttonsContainer}
          variants={itemVariants}
        >
          <motion.button
            style={styles.retryButton}
            whileHover={{ scale: 1.05, backgroundColor: colors.accent.blue }}
            whileTap={{ scale: 0.95 }}
            onClick={resetErrorBoundary}
          >
            <FiRefreshCw size={20} />
            <span>Retry</span>
          </motion.button>
          
          <motion.button
            style={styles.homeButton}
            whileHover={{ scale: 1.05, backgroundColor: colors.primary.light }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
          >
            <FiHome size={20} />
            <span>Return to Mission Control</span>
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
    border: '1px solid rgba(255, 107, 107, 0.3)',
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
    background: 'rgba(255, 107, 107, 0.1)',
    boxShadow: '0 0 15px rgba(255, 107, 107, 0.5)'
  },
  errorTitle: {
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
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
  errorDetails: {
    padding: '1rem',
    background: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 107, 107, 0.2)',
    marginTop: '1rem',
    width: '100%',
    overflowX: 'auto'
  },
  errorText: {
    fontFamily: 'monospace',
    margin: 0,
    color: colors.accent.red,
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    textAlign: 'left',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2.5rem'
  },
  retryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '1rem 2rem',
    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    fontWeight: '600',
    color: colors.text.primary,
    background: colors.accent.red,
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease'
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

export default ErrorFallback; 