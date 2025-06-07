import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
  const gridCanvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [typeCount, setTypeCount] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const gridAnimationFrameRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scanProgress, setScanProgress] = useState(0);
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Scan animation
  useEffect(() => {
    const scanTimer = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 30);
    
    return () => clearInterval(scanTimer);
  }, []);
  
  // Typing animation effect
  useEffect(() => {
    const text = 'articulate';
    const typingSpeed = isDeleting ? 50 : 150;
    const delayBetweenCycles = 2000;
    
    if (!isDeleting && typingText === text) {
      // Complete word - wait before deleting
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, delayBetweenCycles);
      
      return () => clearTimeout(timeout);
    } else if (isDeleting && typingText === '') {
      // Finished deleting - start new cycle
      setIsDeleting(false);
      setTypeCount(prevCount => prevCount + 1);
      
      return () => {};
    }
    
    const timeout = setTimeout(() => {
      setTypingText(current => {
        if (isDeleting) {
          return current.slice(0, -1);
        } else {
          return text.slice(0, current.length + 1);
        }
      });
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [typingText, isDeleting, typeCount]);

  // Add cursor blink animation to document head
  useEffect(() => {
    // Create a style element
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes blink-caret {
        from, to { border-color: transparent }
        50% { border-color: #4facfe }
      }
      
      @keyframes pulse {
        0% { opacity: 0.4; }
        50% { opacity: 0.7; }
        100% { opacity: 0.4; }
      }
      
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    
    // Append to head
    document.head.appendChild(styleEl);
    
    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Handle grid background
  useEffect(() => {
    if (!gridCanvasRef.current) return;
    
    const canvas = gridCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to window size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Draw function for grid
    const drawGrid = (time) => {
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0B0F1A');
      gradient.addColorStop(1, '#01030C');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Grid settings
      const gridSize = 50;
      const perspective = 500;
      const horizonY = canvas.height * 0.5;
      
      // Draw horizontal lines
      for (let y = horizonY; y <= canvas.height; y += 20) {
        // Calculate line spacing based on perspective
        const perspectiveFactor = (y - horizonY) / (canvas.height - horizonY);
        const spacing = gridSize * perspectiveFactor;
        
        if (spacing <= 0) continue;
        
        // Draw the horizontal line
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = `rgba(0, 100, 255, ${0.1 * perspectiveFactor})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw vertical lines with perspective
        for (let x = 0; x < canvas.width; x += spacing) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + spacing * 1.5);
          ctx.strokeStyle = `rgba(0, 100, 255, ${0.1 * perspectiveFactor})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      
      // Add glow at horizon
      const gradient2 = ctx.createLinearGradient(0, horizonY - 50, 0, horizonY + 50);
      gradient2.addColorStop(0, 'rgba(0, 100, 255, 0)');
      gradient2.addColorStop(0.5, 'rgba(0, 100, 255, 0.2)');
      gradient2.addColorStop(1, 'rgba(0, 100, 255, 0)');
      
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, horizonY - 50, canvas.width, 100);
      
      setLoaded(true);
      gridAnimationFrameRef.current = requestAnimationFrame(drawGrid);
    };
    
    gridAnimationFrameRef.current = requestAnimationFrame(drawGrid);
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(gridAnimationFrameRef.current);
    };
  }, []);
  
  const handleClick = () => {
    navigate('/home');
  };
  
  return (
    <div className="landing-page"
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#01030C',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        fontFamily: "'Exo', 'Inter', sans-serif"
      }}
      onClick={handleClick}
    >
      {/* Grid background */}
      <canvas
        ref={gridCanvasRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      />
      
      {/* Targeting reticle - follows mouse */}
      <div
        style={{
          position: 'absolute',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          border: '1px solid rgba(0, 191, 255, 0.5)',
          borderTop: '1px solid rgba(0, 191, 255, 0.9)',
          borderRight: '1px solid rgba(0, 191, 255, 0.9)',
          transform: `translate(${mousePosition.x - 15}px, ${mousePosition.y - 15}px)`,
          zIndex: 10,
          pointerEvents: 'none',
          transition: 'transform 0.05s ease',
          animation: 'rotate 4s linear infinite'
        }}
      />
      
      {/* Small targeting dot */}
      <div
        style={{
          position: 'absolute',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 191, 255, 0.9)',
          transform: `translate(${mousePosition.x - 2}px, ${mousePosition.y - 2}px)`,
          zIndex: 10,
          pointerEvents: 'none',
          boxShadow: '0 0 4px rgba(0, 191, 255, 0.8)'
        }}
      />
      
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
        
        {/* System status indicator */}
        <div style={{
          position: 'absolute',
          top: '30px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '5px',
          zIndex: 3,
        }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              width: '30px',
              height: '4px',
              background: i < scanProgress % 6 ? 'rgba(0, 191, 255, 0.8)' : 'rgba(0, 191, 255, 0.2)',
              animation: i < scanProgress % 6 ? 'pulse 1.5s infinite' : 'none'
            }} />
          ))}
        </div>
        
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
        
        {/* Central logo/title with typing effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          style={{
            fontSize: 'clamp(3rem, 15vw, 6rem)',
            fontFamily: "'Orbitron', 'Space Mono', monospace",
            fontWeight: 700,
            background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            marginBottom: '1rem',
            textShadow: '0 0 20px rgba(79, 172, 254, 0.5)',
            letterSpacing: '2px',
            minHeight: '1.2em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {typingText}
          <span
            style={{ 
              borderRight: '0.1em solid #4facfe',
              animation: 'blink-caret 0.75s step-end infinite',
              marginLeft: '2px'
            }}
          />
        </motion.div>
        
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            fontWeight: 300,
            textAlign: 'center',
            maxWidth: '600px',
            letterSpacing: '1px'
          }}
        >
          Real-time speech insights, powered by AI.
        </motion.div>
        
        {/* Progress scan bar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          style={{
            width: '200px',
            height: '4px',
            backgroundColor: 'rgba(0, 191, 255, 0.2)',
            borderRadius: '2px',
            marginTop: '20px',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              height: '100%',
              width: `${scanProgress}%`,
              backgroundColor: 'rgba(0, 191, 255, 0.8)',
              boxShadow: '0 0 8px rgba(0, 191, 255, 0.8)',
              transition: 'width 0.3s ease'
            }}
          />
        </motion.div>

        {/* Click to continue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.8 }}
          style={{
            marginTop: '3rem',
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
            backdropFilter: 'blur(5px)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated border */}
          <div style={{
            position: 'absolute',
            top: '-2px',
            left: '0',
            width: `${scanProgress}%`,
            height: '2px',
            background: 'linear-gradient(to right, transparent, #4facfe 50%, transparent)',
            boxShadow: '0 0 8px rgba(0, 191, 255, 0.8)',
          }} />
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