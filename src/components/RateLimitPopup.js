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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            color: '#333',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ 
            color: '#e74c3c', 
            marginTop: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V12" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16H12.01" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Server Error or API Limit Reached
          </h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.5' }}>
            We're experiencing an issue with our speech analysis service. This could be due to:
          </p>
          <ul style={{ 
            marginBottom: '20px', 
            paddingLeft: '20px',
            lineHeight: '1.5'
          }}>
            <li>API rate limits being reached (too many requests)</li>
            <li>Server connectivity issues</li>
            <li>Problems with the audio processing</li>
          </ul>
          <p style={{ marginBottom: '20px', lineHeight: '1.5' }}>
            Please wait a moment and try again. If the problem persists, try recording a shorter speech or contact support.
          </p>
          <div style={{ textAlign: 'right' }}>
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RateLimitPopup; 