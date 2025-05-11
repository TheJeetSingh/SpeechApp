import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiFileText } from 'react-icons/fi';
import { colors, animations } from '../styles/theme';

const ScriptModal = ({ isOpen, onClose, onSubmit }) => {
  const [script, setScript] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Reset the script when the modal opens
  useEffect(() => {
    if (isOpen) {
      setScript('');
      setCharCount(0);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle script changes and update character count
  const handleScriptChange = (e) => {
    const newScript = e.target.value;
    setScript(newScript);
    setCharCount(newScript.length);
  };

  // Handle script submission
  const handleSubmit = () => {
    if (script.trim().length === 0) return;
    
    setIsSubmitting(true);
    
    // Simulate a brief loading state
    setTimeout(() => {
      onSubmit(script.trim());
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            style={styles.overlay}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            style={styles.modalContainer}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div 
              style={styles.modalHeader}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div style={styles.titleContainer}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <FiFileText size={28} style={styles.icon} />
                </motion.div>
                <motion.h2 
                  style={styles.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  Enter Your Script
                </motion.h2>
              </div>
              <button
                style={styles.closeButton}
                onClick={onClose}
                aria-label="Close"
              >
                <FiX size={24} />
              </button>
            </motion.div>
            
            <div style={styles.modalContent}>
              <p style={styles.description}>
                Paste or type your speech script below. This will help analyze your delivery against the prepared text.
              </p>
              
              <textarea
                style={{
                  ...styles.scriptTextarea,
                  borderColor: script ? 'rgba(76, 111, 174, 0.8)' : 'rgba(76, 111, 174, 0.5)',
                }}
                value={script}
                onChange={handleScriptChange}
                placeholder="Enter your speech script here..."
                rows={10}
                autoFocus
              />
              
              <div style={{
                ...styles.charCounter,
                color: charCount > 0 
                  ? (charCount > 1000 
                    ? colors.accent.yellow 
                    : colors.text.secondary)
                  : 'rgba(255, 255, 255, 0.4)'
              }}>
                {charCount} characters {charCount > 1000 ? '(getting long!)' : ''}
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              <button
                style={styles.cancelButton}
                onClick={onClose}
                disabled={isSubmitting}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Cancel
              </button>
              <motion.button
                style={{
                  ...styles.submitButton,
                  opacity: (script.trim().length === 0 || isSubmitting) ? 0.6 : 1,
                  cursor: (script.trim().length === 0 || isSubmitting) ? 'not-allowed' : 'pointer',
                }}
                onClick={handleSubmit}
                disabled={script.trim().length === 0 || isSubmitting}
                whileHover={script.trim().length > 0 && !isSubmitting ? { scale: 1.03, boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)' } : {}}
                whileTap={script.trim().length > 0 && !isSubmitting ? { scale: 0.97 } : {}}
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <FiCheckCircle size={18} style={{ marginRight: '8px' }} />
                    Submit Script
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    position: 'relative',
    backgroundColor: colors.background.dark,
    borderRadius: '16px',
    padding: '24px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    zIndex: 1001,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 25px',
    borderBottom: '1px solid rgba(76, 111, 174, 0.3)',
    backgroundColor: 'rgba(42, 82, 152, 0.3)',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  icon: {
    color: colors.accent.blue,
    filter: 'drop-shadow(0 0 3px rgba(109, 172, 255, 0.5))',
  },
  title: {
    margin: 0,
    fontSize: '1.6rem',
    fontWeight: 600,
    color: colors.text.primary,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    "&:hover": {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }
  },
  modalContent: {
    padding: '30px',
  },
  description: {
    fontSize: '1.1rem',
    color: colors.text.secondary,
    marginBottom: '20px',
    lineHeight: 1.6,
  },
  scriptTextarea: {
    width: '100%',
    padding: '20px',
    fontSize: '1.1rem',
    lineHeight: 1.6,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    border: '1px solid rgba(76, 111, 174, 0.5)',
    borderRadius: '10px',
    color: colors.text.primary,
    resize: 'vertical',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
    minHeight: '200px',
    boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.2)',
    '&:focus': {
      borderColor: colors.accent.blue,
      boxShadow: `0 0 0 2px ${colors.accent.blue}40, inset 0 2px 10px rgba(0, 0, 0, 0.2)`,
    }
  },
  charCounter: {
    fontSize: '0.95rem',
    color: colors.text.secondary,
    textAlign: 'right',
    marginTop: '12px',
    fontStyle: 'italic',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '25px',
    borderTop: '1px solid rgba(76, 111, 174, 0.3)',
    gap: '20px',
    backgroundColor: 'rgba(20, 35, 60, 0.4)',
  },
  cancelButton: {
    padding: '12px 24px',
    fontSize: '1.05rem',
    fontWeight: 500,
    backgroundColor: 'transparent',
    color: colors.text.primary,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 30px',
    fontSize: '1.05rem',
    fontWeight: 500,
    backgroundColor: colors.accent.blue,
    color: colors.text.primary,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    opacity: (props) => (props.disabled ? 0.6 : 1),
    background: `linear-gradient(135deg, ${colors.accent.blue}, #2460c9)`,
  },
};

export default ScriptModal; 