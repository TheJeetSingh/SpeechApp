import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Aurora from './Aurora';

/* 
POTENTIAL FUTURISTIC ENHANCEMENTS:

1. HOLOGRAPHIC INTERFACES:
   - Add semi-transparent floating panels with futuristic data
   - Implement perspective transforms and 3D rotations on hover
   - Use CSS transform-style: preserve-3d and perspective properties

2. AUGMENTED REALITY ELEMENTS:
   - Add targeting reticles that follow cursor
   - Create "scanning" animations when user hovers over elements
   - Implement face/object tracking overlays using webcam (with permission)

3. DIGITAL GRID BACKGROUNDS:
   - Create Tron-style grid pattern that extends to horizon
   - Animate grid lines that pulse with sound or user interaction
   - Add subtle perspective effect to create 3D sensation

4. GLITCH EFFECTS:
   - Add random digital glitches to text elements
   - Create RGB color splitting effects on hover
   - Implement noise/static overlays on certain elements

5. INTERACTIVE PARTICLE SYSTEM:
   - Make particles react to mouse movement
   - Create gravity wells or force fields around cursor
   - Implement particle formations that spell words

6. FUTURISTIC HUD ELEMENTS:
   - Add circular data displays with animated progress
   - Create angular brackets that frame important elements
   - Implement "scanning" or "processing" animations

7. MATRIX-STYLE RAINING CODE:
   - Add subtle background of falling characters
   - Create columns of characters that fall at different speeds
   - Use green or blue hues for classic digital effect

8. VOICE INTEGRATION:
   - Add voice command recognition (matches product theme)
   - Implement sound wave visualization when speaking
   - Create responsive UI elements that react to speech

9. NEURAL NETWORK VISUALIZATION:
   - Animate nodes and connections mimicking neural network
   - Make connections light up in sequences to simulate data flow
   - Create organic-looking movement patterns that feel "intelligent"

10. LOADING SEQUENCES:
    - Add circular loading indicators that fill clockwise
    - Implement "data processing" progress bars
    - Create typing animations for system status messages
*/

// Define the cursor animation style
const cursorBlinkStyle = {
  '@keyframes blinkCaret': {
    '0%, 100%': { borderColor: 'transparent' },
    '50%': { borderColor: '#4facfe' }
  }
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  
  // Feature phrases for the animated text
  const phrases = [
    "Learn to speak with confidence",
    "Analyze your speech patterns",
    "Improve your public speaking",
    "Get real-time feedback on delivery",
    "Master the art of communication"
  ];
  
  // Current phrase index to show
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  
  // State to trigger blur animation replay
  const [blurKey, setBlurKey] = useState(0);
  
  // Auto-rotate phrases every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex(prev => (prev + 1) % phrases.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  // Replay blur animation every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBlurKey(prev => prev + 1);
    }, 12000);
    
    return () => clearInterval(interval);
  }, []);

  // Set loaded state after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Add animations to document head
  useEffect(() => {
    // Create a style element
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes pulse {
        0% { opacity: 0.4; }
        50% { opacity: 0.7; }
        100% { opacity: 0.4; }
      }
    `;
    
    // Append to head
    document.head.appendChild(styleEl);
    
    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  const handleClick = () => {
    navigate('/home');
  };
  
  // Animation variants for the split text phrases
  const phraseContainer = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i }
    }),
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.02, staggerDirection: -1 }
    }
  };
  
  const phraseChild = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };
  
  // Animation variants for blur text effect with slower timing
  const titleContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,  // Increased stagger timing between characters
        delayChildren: 0.1,    // Added a slight delay before the first character
        duration: 3           // Overall container animation duration
      }
    }
  };
  
  const titleChild = {
    hidden: { 
      opacity: 0,
      filter: "blur(20px)",  // Increased blur amount
      scale: 1.3             // Increased scale for more dramatic effect
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 1.8,        // Increased duration for each character
        ease: "easeOut"
      }
    }
  };

  const logoText = "articulate";
  
  return (
    <div className="landing-page"
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(to bottom, #040913, #010209)',
        overflow: 'hidden',
        cursor: 'default',
        position: 'relative',
        fontFamily: "'Exo', 'Inter', sans-serif"
      }}
      onClick={handleClick}
    >
      {/* Aurora background */}
      <Aurora />
      
      {/* Content area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 3,
          padding: '20px'
        }}
      >
        {/* HUD Element: Top corners */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '40px',
          height: '40px',
          borderLeft: '2px solid rgba(0, 191, 255, 0.6)',
          borderTop: '2px solid rgba(0, 191, 255, 0.6)',
        }} />
        
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          borderRight: '2px solid rgba(0, 191, 255, 0.6)',
          borderTop: '2px solid rgba(0, 191, 255, 0.6)',
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '70px',
          left: '20px',
          width: '40px',
          height: '40px',
          borderLeft: '2px solid rgba(0, 191, 255, 0.6)',
          borderBottom: '2px solid rgba(0, 191, 255, 0.6)',
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '70px',
          right: '20px',
          width: '40px',
          height: '40px',
          borderRight: '2px solid rgba(0, 191, 255, 0.6)',
          borderBottom: '2px solid rgba(0, 191, 255, 0.6)',
        }} />
        
        {/* Top title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            color: '#00BFFF',
            fontSize: '1rem',
            fontWeight: 500,
            letterSpacing: '3px',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            position: 'relative',
            padding: '0 15px'
          }}
        >
          <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}>{"["}</span>
          Speech. AI. Redefined.
          <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
            {"]"}
          </span>
        </motion.div>
        
        {/* Central logo/title - blur text animation */}
        <motion.div
          key={blurKey}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '2rem'
          }}
          variants={titleContainer}
          initial="hidden"
          animate="visible"
        >
          {logoText.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={titleChild}
              style={{
                fontSize: 'clamp(3.5rem, 15vw, 7rem)',
                fontFamily: "'Orbitron', 'Space Mono', monospace",
                fontWeight: 700,
                background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
                textShadow: '0 0 20px rgba(79, 172, 254, 0.5)',
                letterSpacing: '2px'
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
        
        {/* Split text animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhraseIndex}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              padding: '0.5rem 1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              backdropFilter: 'blur(5px)',
              background: 'rgba(255, 255, 255, 0.05)',
              minHeight: '4rem',
              minWidth: '280px',
              width: 'auto'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              style={{
                display: 'flex',
                overflow: 'hidden'
              }}
              variants={phraseContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {phrases[currentPhraseIndex].split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={phraseChild}
                  style={{
                    fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    color: '#FFFFFF',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                    display: 'inline-block',
                    whiteSpace: 'pre'
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Click to continue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.8 }}
          style={{
            marginTop: '4rem',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
            fontWeight: 300,
            textAlign: 'center',
            maxWidth: '600px',
            letterSpacing: '1px',
            padding: '10px 20px',
            border: '1px solid rgba(79, 172, 254, 0.3)',
            borderRadius: '4px',
            background: 'rgba(0, 0, 20, 0.3)',
            backdropFilter: 'blur(5px)'
          }}
        >
          Click anywhere to continue
        </motion.div>
      </motion.div>
      
      {/* Footer bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 0.8 : 0 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          color: 'rgba(255, 255, 255, 0.6)',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.8rem',
          letterSpacing: '1px',
          padding: '10px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 4,
          textShadow: '0 0 10px rgba(0, 191, 255, 0.3)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            backgroundColor: 'rgba(0, 191, 255, 0.6)', 
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }} />
          AI Speech Engine v0.9.2 | All signal, no noise.
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage; 