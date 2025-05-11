import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RateLimitPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '15px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <h3 style={{ 
            color: '#1a365d', 
            marginTop: 0,
            marginBottom: '1rem',
            fontSize: '1.5rem' 
          }}>
            Rate Limit Reached
          </h3>
          <p style={{ 
            color: '#4a5568',
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}>
            Oops! There are too many people using this feature right now. Please try again in a few minutes.
          </p>
          <button
            onClick={onClose}
            style={{
              background: '#4299e1',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.target.style.background = '#3182ce'}
            onMouseOut={e => e.target.style.background = '#4299e1'}
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RateLimitPopup; 