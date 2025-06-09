import React, { useRef } from 'react';
import { useMouse } from 'react-use';
import './ChromaGrid.css';

const ChromaGrid = ({ isLoggedIn, userName, userEmail }) => {
  const containerRef = useRef(null);
  const { elX, elY } = useMouse(containerRef);

  const gradientStyle = {
    background: `radial-gradient(circle at ${elX}px ${elY}px, rgba(79, 172, 254, 0.3), rgba(0, 0, 0, 0) 40%)`
  };

  return (
    <div ref={containerRef} className="chroma-card-container">
      <div className="chroma-card-glow" style={gradientStyle}></div>
      <div className="chroma-card-content">
        <div className="chroma-card-avatar">
          {userName ? userName.charAt(0).toUpperCase() : 'G'}
        </div>
        <div className="chroma-card-user-info">
          <h3>{userName || "Guest User"}</h3>
          <p>{isLoggedIn ? (userEmail || 'Signed in') : ""}</p>
        </div>
      </div>
    </div>
  );
};

export default ChromaGrid; 