import React, { useEffect } from 'react';

const StickFigureSpeechAnimation = () => {
  useEffect(() => {
    // Add any setup code here if needed
    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div className="animation-container" style={styles.container}>
      {/* Stage/Podium */}
      <div style={styles.stage}></div>
      
      {/* Stick Figure */}
      <div style={styles.figure}>
        {/* Head */}
        <div style={styles.head}></div>
        
        {/* Body */}
        <div style={styles.body}></div>
        
        {/* Arms */}
        <div style={styles.leftArm}></div>
        <div style={styles.rightArm}></div>
        
        {/* Legs */}
        <div style={styles.leftLeg}></div>
        <div style={styles.rightLeg}></div>
      </div>
      
      {/* Speech Bubble */}
      <div style={styles.speechBubble}>
        <div style={styles.dot1}></div>
        <div style={styles.dot2}></div>
        <div style={styles.dot3}></div>
      </div>
      
      {/* Audience */}
      <div style={styles.audience}>
        {Array(15).fill().map((_, i) => (
          <div key={i} style={{
            ...styles.audienceMember,
            left: `${5 + (i % 5) * 20}%`,
            bottom: `${5 + Math.floor(i / 5) * 10}%`,
            animationDelay: `${i * 0.1}s`
          }}></div>
        ))}
      </div>
    </div>
  );
};

// Define the animation keyframes as a string
const keyframesStyle = `
@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  75% { transform: rotate(-15deg); }
}

@keyframes talk {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes pulse {
  0% { opacity: 0.7; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.7; transform: scale(0.8); }
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes dot-pulse {
  0% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.2; transform: scale(0.8); }
}
`;

// Add the keyframes to the document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = keyframesStyle;
  document.head.appendChild(style);
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, #f0f8ff, #e6f0ff)',
    overflow: 'hidden',
    zIndex: -1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stage: {
    position: 'absolute',
    bottom: '20%',
    width: '30%',
    height: '5%',
    backgroundColor: '#8B4513',
    borderRadius: '10px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    zIndex: 1,
  },
  figure: {
    position: 'absolute',
    bottom: '25%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
    animation: 'bob 2s ease-in-out infinite',
  },
  head: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#333333',
    position: 'relative',
    left: '-15px',
  },
  body: {
    width: '4px',
    height: '60px',
    backgroundColor: '#333333',
    position: 'relative',
    left: '-2px',
    top: '0px',
  },
  leftArm: {
    width: '40px',
    height: '4px',
    backgroundColor: '#333333',
    position: 'absolute',
    top: '40px',
    left: '-40px',
    transformOrigin: 'right center',
    animation: 'wave 2s ease-in-out infinite',
  },
  rightArm: {
    width: '40px',
    height: '4px',
    backgroundColor: '#333333',
    position: 'absolute',
    top: '40px',
    left: '2px',
    transformOrigin: 'left center',
    animation: 'wave 2s ease-in-out alternate infinite',
  },
  leftLeg: {
    width: '4px',
    height: '40px',
    backgroundColor: '#333333',
    position: 'absolute',
    top: '60px',
    left: '-8px',
    transform: 'rotate(15deg)',
    transformOrigin: 'top center',
  },
  rightLeg: {
    width: '4px',
    height: '40px',
    backgroundColor: '#333333',
    position: 'absolute',
    top: '60px',
    left: '4px',
    transform: 'rotate(-15deg)',
    transformOrigin: 'top center',
  },
  speechBubble: {
    position: 'absolute',
    top: '15%',
    left: '55%',
    width: '80px',
    height: '40px',
    backgroundColor: 'white',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    animation: 'pulse 2s ease-in-out infinite',
    zIndex: 2,
  },
  dot1: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#333',
    margin: '0 3px',
    animation: 'dot-pulse 1.5s ease-in-out infinite',
  },
  dot2: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#333',
    margin: '0 3px',
    animation: 'dot-pulse 1.5s ease-in-out 0.5s infinite',
  },
  dot3: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#333',
    margin: '0 3px',
    animation: 'dot-pulse 1.5s ease-in-out 1s infinite',
  },
  audience: {
    position: 'absolute',
    bottom: '5%',
    width: '80%',
    height: '15%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    zIndex: 1,
  },
  audienceMember: {
    position: 'absolute',
    width: '15px',
    height: '25px',
    backgroundColor: '#555',
    borderRadius: '50% 50% 0 0',
    animation: 'bob 3s ease-in-out infinite',
  },
  podium: {
    width: '100%',
    height: '10%',
    backgroundColor: '#8B4513',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.3)',
  },
};

export default StickFigureSpeechAnimation; 