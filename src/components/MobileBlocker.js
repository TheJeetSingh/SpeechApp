import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MobileBlocker = () => {
  const [override, setOverride] = useState(false);

  if (override) {
    return null; // If user overrides, don't show the blocker
  }

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e3c72',
    backgroundImage: 'linear-gradient(to right, #1e3c72, #2a5298)',
    zIndex: 9999,
    padding: '20px',
    textAlign: 'center',
    color: 'white',
  };

  const logoStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
  };

  const messageContainerStyle = {
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(5px)',
    borderRadius: '15px',
    padding: '25px',
    maxWidth: '90%',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  const headingStyle = {
    fontSize: '1.5rem',
    marginBottom: '15px',
    fontWeight: 'bold',
  };

  const paragraphStyle = {
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '15px',
  };

  const comingSoonStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    margin: '25px 0 15px',
    color: '#36D6E7',
  };

  const buttonStyle = {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '8px',
    padding: '10px 20px',
    marginTop: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: 'bold',
  };

  const handleOverride = () => {
    setOverride(true);
    // Store preference in localStorage to remember the choice
    localStorage.setItem('articulate_mobile_override', 'true');
  };

  return (
    <motion.div 
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        style={logoStyle}
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Articulate
      </motion.div>
      
      <motion.div 
        style={messageContainerStyle}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div style={headingStyle}>Desktop Experience Only</div>
        <p style={paragraphStyle}>
          Articulate is currently optimized for desktop and laptop browsers only.
          For the best speech practice experience, please visit us from a computer.
        </p>
        <p style={paragraphStyle}>
          Our comprehensive speech tools require a larger screen and more processing power
          than most mobile devices can provide.
        </p>
        <div style={comingSoonStyle}>Mobile App Coming Soon!</div>
        <p style={paragraphStyle}>
          We're working on a dedicated mobile experience that will bring Articulate's
          speech enhancement tools to your pocket.
        </p>
        <motion.button 
          style={buttonStyle} 
          onClick={handleOverride}
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
          whileTap={{ scale: 0.95 }}
        >
          Continue Anyway (Not Recommended)
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default MobileBlocker; 