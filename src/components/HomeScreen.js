import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowDown, FiArrowUp, FiLogOut, FiLogIn, FiTarget, FiCpu, FiZap, FiBookOpen, FiEdit, FiGlobe, FiUser, FiSettings, FiChevronRight } from "react-icons/fi";
import { BsMicFill, BsBarChartFill, BsLightbulbFill, BsArrowRepeat } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";
import { useSpring, animated } from 'react-spring';
import { TypeAnimation } from 'react-type-animation';
import { useInterval, useMouse, useWindowSize } from 'react-use';
import Aurora from './Aurora';
import ChromaGrid from './ChromaGrid';

// StickFigureSpeechAnimation component for fallback when audio permissions are denied
const StickFigureSpeechAnimation = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Colors
    const colors = {
      background: '#e8f0ff',
      podium: '#8B4513',
      stickFigure: '#1e3c72',
      stickFigureAccent: '#00BFFF',
      audience: ['#555555', '#1e3c72', '#00BFFF', '#36D6E7', '#FF5E7D', '#7C4DFF', '#9370DB', '#4CAF50'],
      bubbles: ['#1e3c72', '#2a5298', '#00BFFF', '#36D6E7', '#FF5E7D', '#7C4DFF', '#FF9800', '#9C27B0'],
      spotlight: 'rgba(255, 255, 220, 0.2)'
    };
    
    // Animation state
    let animationId;
    let startTime = Date.now();
    
    // Create audience members (simplified stick figures)
    const audienceMembers = [];
    for (let i = 0; i < 45; i++) {
      audienceMembers.push({
        x: Math.random() * canvas.width,
        y: canvas.height * 0.75 + Math.random() * (canvas.height * 0.2),
        size: 10 + Math.random() * 7,
        clapping: Math.random() > 0.6, // Some audience members are clapping
        nodding: Math.random() > 0.5, // Some audience members are nodding
        clapSpeed: 0.5 + Math.random() * 2,
        clapOffset: Math.random() * Math.PI * 2,
        color: colors.audience[Math.floor(Math.random() * colors.audience.length)],
        hasHat: Math.random() > 0.8, // Some audience members have hats
        hasGlasses: Math.random() > 0.85, // Some have glasses
        hatColor: colors.bubbles[Math.floor(Math.random() * colors.bubbles.length)], // Assign fixed hat color
      });
    }
    
    // Speech bubbles
    const speechBubbles = [];
    for (let i = 0; i < 15; i++) {
      speechBubbles.push({
        x: canvas.width * 0.5,
        y: canvas.height * 0.3,
        size: 5 + Math.random() * 15,
        speedX: (Math.random() - 0.5) * 2,
        speedY: -1 - Math.random() * 2,
        color: colors.bubbles[Math.floor(Math.random() * colors.bubbles.length)],
        opacity: 0.1 + Math.random() * 0.5,
        life: 0,
        maxLife: 100 + Math.random() * 200,
        text: Math.random() > 0.7 ? speechTexts[Math.floor(Math.random() * speechTexts.length)] : null
      });
    }
    
    // Text content to display in speech bubbles
    const speechTexts = [
      "Speech",
      "Public Speaking",
      "Voice",
      "Clarity",
      "Articulate",
      "Tone",
      "Gesture",
      "Presentation",
      "Audience",
      "Confidence",
      "Impact",
      "Persuasion"
    ];
    
    // Draw a stick figure at the podium
    const drawStickFigure = (time) => {
      const centerX = canvas.width * 0.5;
      const podiumTop = canvas.height * 0.55;
      const headY = podiumTop - 80;
      
      // Draw spotlight with rainbow gradient
      const spotlightGradient = ctx.createRadialGradient(
        centerX, podiumTop - 40, 20,
        centerX, podiumTop - 40, 200
      );
      
      // Create rainbow spotlight
      spotlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      spotlightGradient.addColorStop(0.2, 'rgba(255, 200, 200, 0.3)');
      spotlightGradient.addColorStop(0.4, 'rgba(200, 255, 200, 0.2)');
      spotlightGradient.addColorStop(0.6, 'rgba(200, 200, 255, 0.2)');
      spotlightGradient.addColorStop(0.8, 'rgba(255, 255, 200, 0.1)');
      spotlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = spotlightGradient;
      ctx.beginPath();
      ctx.ellipse(centerX, podiumTop + 10, 200, 70, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw podium
      const podiumGradient = ctx.createLinearGradient(
        centerX - 50, podiumTop, 
        centerX + 50, podiumTop
      );
      podiumGradient.addColorStop(0, '#8B4513');
      podiumGradient.addColorStop(0.5, '#A05A2C');
      podiumGradient.addColorStop(1, '#8B4513');
      
      ctx.fillStyle = podiumGradient;
      ctx.fillRect(centerX - 50, podiumTop, 100, 30);
      
      // Add podium details with grain texture
      ctx.fillRect(centerX - 15, podiumTop + 30, 30, 50);
      
      // Add wood grain texture to podium
      ctx.strokeStyle = 'rgba(80, 40, 0, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX - 50, podiumTop + i * 5);
        ctx.bezierCurveTo(
          centerX - 20, podiumTop + i * 5 + Math.sin(i) * 3,
          centerX + 20, podiumTop + i * 5 + Math.cos(i) * 3,
          centerX + 50, podiumTop + i * 5
        );
        ctx.stroke();
      }
      
      // Add microphone
      ctx.beginPath();
      ctx.moveTo(centerX + 40, podiumTop - 20);
      ctx.lineTo(centerX + 40, podiumTop);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.ellipse(centerX + 40, podiumTop - 25, 8, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#111';
      ctx.fill();
      
      // Draw microphone highlights
      ctx.beginPath();
      ctx.ellipse(centerX + 38, podiumTop - 27, 2, 3, Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
      
      // Draw stick figure
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Head
      const headBobbing = Math.sin(time * 1.5) * 2; // Subtle head movement
      
      // Draw shadow beneath the head
      ctx.beginPath();
      ctx.ellipse(centerX, headY + 20, 10, 3, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fill();
      
      // Draw the head
      ctx.beginPath();
      ctx.arc(centerX, headY + headBobbing, 15, 0, Math.PI * 2);
      const headGradient = ctx.createLinearGradient(centerX - 15, headY, centerX + 15, headY);
      headGradient.addColorStop(0, colors.stickFigure);
      headGradient.addColorStop(1, '#2a5298');
      ctx.fillStyle = headGradient;
      ctx.fill();
      
      // Add a tie
      ctx.beginPath();
      ctx.moveTo(centerX, headY + headBobbing + 15);
      ctx.lineTo(centerX - 5, headY + headBobbing + 25);
      ctx.lineTo(centerX, headY + headBobbing + 40);
      ctx.lineTo(centerX + 5, headY + headBobbing + 25);
      ctx.closePath();
      ctx.fillStyle = '#FF5E7D';
      ctx.fill();
      
      // Body
      ctx.beginPath();
      ctx.moveTo(centerX, headY + headBobbing + 15);
      ctx.lineTo(centerX, podiumTop - 15);
      ctx.strokeStyle = colors.stickFigure;
      ctx.stroke();
      
      // Arms - animated gesturing
      const leftArmMovement = Math.sin(time * 2) * 15;
      const rightArmMovement = Math.sin(time * 2.5 + 1) * 20;
      
      // Left arm
      ctx.beginPath();
      ctx.moveTo(centerX, headY + headBobbing + 30);
      ctx.quadraticCurveTo(
        centerX - 15, headY + headBobbing + 15 + leftArmMovement * 0.5,
        centerX - 25, headY + 20 + leftArmMovement
      );
      ctx.strokeStyle = colors.stickFigureAccent;
      ctx.lineWidth = 3.5;
      ctx.stroke();
      
      // Right arm - more animated for speech gestures
      ctx.beginPath();
      ctx.moveTo(centerX, headY + headBobbing + 30);
      ctx.quadraticCurveTo(
        centerX + 15 + Math.sin(time * 3) * 5, 
        headY + headBobbing + 15 + rightArmMovement * 0.3,
        centerX + 30 + Math.sin(time * 3) * 10, 
        headY + 15 + rightArmMovement
      );
      ctx.strokeStyle = colors.stickFigureAccent;
      ctx.stroke();
      
      // Face details - dynamically animate
      // Mouth - animated talking
      const mouthWidth = 5 + Math.sin(time * 10) * 3;
      const mouthHeight = 2 + Math.sin(time * 9) * 2;
      
      ctx.beginPath();
      ctx.ellipse(
        centerX, 
        headY + headBobbing + 5, 
        mouthWidth,
        mouthHeight,
        0, 0, Math.PI
      );
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Eyes
      const blinkRate = Math.sin(time * 0.5 + 2) > 0.95;
      const eyeHeight = blinkRate ? 1 : 3;
      
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(centerX - 5, headY + headBobbing - 3, 3, eyeHeight, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.ellipse(centerX + 5, headY + headBobbing - 3, 3, eyeHeight, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Add eyebrows for expression
      const eyebrowRaise = Math.sin(time * 1.2) * 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX - 8, headY + headBobbing - 6 + eyebrowRaise);
      ctx.lineTo(centerX - 2, headY + headBobbing - 7 + eyebrowRaise);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(centerX + 2, headY + headBobbing - 7 + eyebrowRaise);
      ctx.lineTo(centerX + 8, headY + headBobbing - 6 + eyebrowRaise);
      ctx.stroke();
      
      // Add glasses occasionally based on time
      if (Math.sin(time * 0.3) > 0.5) {
        ctx.beginPath();
        ctx.ellipse(centerX - 5, headY + headBobbing - 3, 4, 4, 0, 0, Math.PI * 2);
        ctx.moveTo(centerX + 1, headY + headBobbing - 3);
        ctx.ellipse(centerX + 5, headY + headBobbing - 3, 4, 4, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Bridge of glasses
        ctx.beginPath();
        ctx.moveTo(centerX - 1, headY + headBobbing - 3);
        ctx.lineTo(centerX + 1, headY + headBobbing - 3);
        ctx.stroke();
      }
    };
    
    // Draw an audience member
    const drawAudienceMember = (member, time) => {
      // Head with optional nodding movement
      const headNod = member.nodding ? Math.sin(time * 1.2 + member.clapOffset) * 2 : 0;
      
      ctx.beginPath();
      ctx.arc(member.x, member.y - member.size + headNod, member.size * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = member.color;
      ctx.fill();
      
      // Body
      ctx.beginPath();
      ctx.moveTo(member.x, member.y - member.size * 0.4 + headNod);
      ctx.lineTo(member.x, member.y + member.size * 0.8);
      ctx.strokeStyle = member.color;
      ctx.lineWidth = Math.max(2, member.size / 5);
      ctx.stroke();
      
      // Add hat if applicable
      if (member.hasHat) {
        ctx.beginPath();
        ctx.moveTo(member.x - member.size * 0.8, member.y - member.size * 1.2 + headNod);
        ctx.lineTo(member.x + member.size * 0.8, member.y - member.size * 1.2 + headNod);
        ctx.lineTo(member.x, member.y - member.size * 1.6 + headNod);
        ctx.closePath();
        ctx.fillStyle = member.hatColor; // Use consistent hat color from member object
        ctx.fill();
      }
      
      // Arms - some are clapping
      if (member.clapping) {
        const clapPosition = Math.sin(time * member.clapSpeed + member.clapOffset) * 0.5;
        const clapOpening = Math.abs(clapPosition);
        
        // Clapping hands
        ctx.beginPath();
        ctx.moveTo(member.x, member.y - member.size * 0.2 + headNod);
        ctx.lineTo(member.x - member.size * (0.4 - clapOpening/2), member.y - member.size * 0.1 + clapPosition * 5 + headNod);
        ctx.moveTo(member.x, member.y - member.size * 0.2 + headNod);
        ctx.lineTo(member.x + member.size * (0.4 - clapOpening/2), member.y - member.size * 0.1 + clapPosition * 5 + headNod);
        ctx.stroke();
        
        // Draw small circles at the hands for clapping effect when hands meet
        if (clapPosition < 0.1) {
          ctx.beginPath();
          ctx.arc(member.x, member.y - member.size * 0.1 + clapPosition * 5 + headNod, member.size * 0.15, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fill();
        }
      } else {
        // Regular arms
        ctx.beginPath();
        ctx.moveTo(member.x, member.y - member.size * 0.2 + headNod);
        ctx.lineTo(member.x - member.size * 0.6, member.y + headNod);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(member.x, member.y - member.size * 0.2 + headNod);
        ctx.lineTo(member.x + member.size * 0.6, member.y + headNod);
        ctx.stroke();
      }
      
      // Simple face (eyes)
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(member.x - member.size * 0.2, member.y - member.size * 1.1 + headNod, member.size * 0.15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(member.x + member.size * 0.2, member.y - member.size * 1.1 + headNod, member.size * 0.15, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glasses if applicable
      if (member.hasGlasses) {
        ctx.beginPath();
        ctx.ellipse(member.x - member.size * 0.2, member.y - member.size * 1.1 + headNod, member.size * 0.2, member.size * 0.2, 0, 0, Math.PI * 2);
        ctx.moveTo(member.x + member.size * 0.0, member.y - member.size * 1.1 + headNod);
        ctx.ellipse(member.x + member.size * 0.2, member.y - member.size * 1.1 + headNod, member.size * 0.2, member.size * 0.2, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Bridge of glasses
        ctx.beginPath();
        ctx.moveTo(member.x - member.size * 0.0, member.y - member.size * 1.1 + headNod);
        ctx.lineTo(member.x + member.size * 0.0, member.y - member.size * 1.1 + headNod);
        ctx.stroke();
      }
      
      // Add smile
      ctx.beginPath();
      ctx.arc(member.x, member.y - member.size * 0.9 + headNod, member.size * 0.3, 0, Math.PI);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    };
    
    // Update and draw speech bubbles
    const updateAndDrawSpeechBubbles = (time, deltaTime) => {
      // Add new bubbles
      if (Math.random() < 0.1) {
        const centerX = canvas.width * 0.5;
        const podiumTop = canvas.height * 0.55;
        const headY = podiumTop - 80;
        
        speechBubbles.push({
          x: centerX + (Math.random() - 0.5) * 10,
          y: headY + 5,
          size: 3 + Math.random() * 10,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: -1 - Math.random() * 1.5,
          color: colors.bubbles[Math.floor(Math.random() * colors.bubbles.length)],
          opacity: 0.2 + Math.random() * 0.4,
          life: 0,
          maxLife: 100 + Math.random() * 150,
          text: Math.random() > 0.7 ? speechTexts[Math.floor(Math.random() * speechTexts.length)] : null
        });
      }
      
      // Update and draw bubbles
      for (let i = 0; i < speechBubbles.length; i++) {
        const bubble = speechBubbles[i];
        
        // Update position
        bubble.x += bubble.speedX;
        bubble.y += bubble.speedY;
        bubble.life += deltaTime;
        
        // Fade out as life increases
        const lifeRatio = bubble.life / bubble.maxLife;
        const fadeOpacity = bubble.opacity * (1 - lifeRatio);
        
        // Draw bubble
        ctx.beginPath();
        
        // Speech bubble with tail if it has text
        if (bubble.text) {
          // Draw a speech bubble shape with tail
          ctx.beginPath();
          const textWidth = ctx.measureText(bubble.text).width;
          const bubbleWidth = Math.max(textWidth + 10, bubble.size * 4);
          const bubbleHeight = bubble.size * 2;
          
          // Rounded rectangle for bubble
          const bubbleX = bubble.x - bubbleWidth / 2;
          const bubbleY = bubble.y - bubbleHeight / 2;
          const radius = 5;
          
          ctx.moveTo(bubbleX + radius, bubbleY);
          ctx.lineTo(bubbleX + bubbleWidth - radius, bubbleY);
          ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + radius);
          ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - radius);
          ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - radius, bubbleY + bubbleHeight);
          
          // Add tail
          const tailX = bubble.x;
          ctx.lineTo(tailX + 10, bubbleY + bubbleHeight);
          ctx.lineTo(tailX, bubbleY + bubbleHeight + 10);
          ctx.lineTo(tailX - 10, bubbleY + bubbleHeight);
          
          ctx.lineTo(bubbleX + radius, bubbleY + bubbleHeight);
          ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - radius);
          ctx.lineTo(bubbleX, bubbleY + radius);
          ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + radius, bubbleY);
          ctx.closePath();
          
          ctx.fillStyle = `${bubble.color}${Math.floor(fadeOpacity * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
          
          // Add text
          ctx.fillStyle = `rgba(255, 255, 255, ${fadeOpacity * 1.2})`;
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(bubble.text, bubble.x, bubble.y);
        } else {
          // Regular bubble
          ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
          ctx.fillStyle = `${bubble.color}${Math.floor(fadeOpacity * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
        }
        
        // Remove old bubbles
        if (bubble.life > bubble.maxLife) {
          speechBubbles.splice(i, 1);
          i--;
        }
      }
    };
    
    // Draw colorful confetti occasionally
    const drawConfetti = (time) => {
      // Only draw confetti at certain intervals
      if (Math.sin(time * 0.5) > 0.8) {
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * canvas.width;
          const y = canvas.height * 0.3 + Math.random() * (canvas.height * 0.3);
          const size = 2 + Math.random() * 5;
          const angle = Math.random() * Math.PI * 2;
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          
          // Different confetti shapes
          const shapeType = Math.floor(Math.random() * 3);
          
          if (shapeType === 0) {
            // Rectangle
            ctx.fillStyle = colors.bubbles[Math.floor(Math.random() * colors.bubbles.length)];
            ctx.fillRect(-size/2, -size/2, size, size);
          } else if (shapeType === 1) {
            // Circle
            ctx.beginPath();
            ctx.arc(0, 0, size/2, 0, Math.PI * 2);
            ctx.fillStyle = colors.bubbles[Math.floor(Math.random() * colors.bubbles.length)];
            ctx.fill();
          } else {
            // Triangle
            ctx.beginPath();
            ctx.moveTo(0, -size/2);
            ctx.lineTo(size/2, size/2);
            ctx.lineTo(-size/2, size/2);
            ctx.closePath();
            ctx.fillStyle = colors.bubbles[Math.floor(Math.random() * colors.bubbles.length)];
            ctx.fill();
          }
          
          ctx.restore();
        }
      }
    };
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000; // time in seconds
      const deltaTime = 1/60; // Approximation for delta time
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#e8f0ff');
      bgGradient.addColorStop(1, '#d0e1ff');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add subtle stage floor
      const floorGradient = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
      floorGradient.addColorStop(0, '#d8e8ff');
      floorGradient.addColorStop(1, '#c0d8ff');
      ctx.fillStyle = floorGradient;
      ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);
      
      // Add a subtle stage line
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.6);
      ctx.lineTo(canvas.width, canvas.height * 0.6);
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw confetti
      drawConfetti(elapsed);
      
      // Draw audience
      for (const member of audienceMembers) {
        drawAudienceMember(member, elapsed);
      }
      
      // Draw stick figure speaker
      drawStickFigure(elapsed);
      
      // Update and draw speech bubbles
      updateAndDrawSpeechBubbles(elapsed, deltaTime);
      
      // Continue animation
      animationId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reposition audience members
      for (let i = 0; i < audienceMembers.length; i++) {
        audienceMembers[i].x = Math.random() * canvas.width;
        audienceMembers[i].y = canvas.height * 0.75 + Math.random() * (canvas.height * 0.2);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1 
      }} 
    />
  );
};

// Add TypeWriter component before HomeScreen component
const TypeWriter = ({ text, delay = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentIndex < text.length) {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(currentIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000); // Wait 2s before deleting
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(prev => prev.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex(0);
        }
      }
    }, isDeleting ? delay / 2 : delay);

    return () => clearTimeout(timeout);
  }, [currentIndex, text, delay, isDeleting, displayText]);

  return (
    <motion.span
      style={{
        display: "inline-block",
        color: "#000000",
      }}
    >
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        |
      </motion.span>
    </motion.span>
  );
};

// GlitchText component for a cyberpunk-style glitch effect
const GlitchText = ({ text }) => {
  return (
    <motion.div
      style={{
        position: "relative",
        display: "inline-block",
        color: "#000000",
        fontWeight: "bold",
      }}
    >
      <motion.span>{text}</motion.span>
      
      {/* Red glitch layer */}
      <motion.span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          color: "#ff0000",
          mixBlendMode: "multiply",
          opacity: 0.8,
        }}
        animate={{
          x: [0, -4, 5, -5, 0, 3, 0],
          opacity: [0, 0.8, 0, 0.8, 0, 0.8, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.span>
      
      {/* Blue glitch layer */}
      <motion.span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          color: "#00BFFF",
          mixBlendMode: "multiply",
          opacity: 0.8,
        }}
        animate={{
          x: [0, 4, -5, 5, 0, -3, 0],
          opacity: [0, 0.8, 0, 0.8, 0, 0.8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1],
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.span>
      
      {/* Distortion flicker */}
      <motion.span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          color: "#ffffff",
          textShadow: "2px 2px 0px #000000",
          clipPath: "inset(0 0 0 0)",
          opacity: 0,
        }}
        animate={{
          opacity: [0, 1, 0, 1, 0],
          clipPath: [
            "inset(0 0 0 0)",
            "inset(10% 0 0 0)",
            "inset(20% 0 30% 0)",
            "inset(0 0 10% 30%)",
            "inset(0 0 0 0)"
          ],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 3,
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

// FloatingText component with gentle floating animation for each character
const FloatingText = ({ text }) => {
  return (
    <motion.div style={{ display: "inline-block", color: "#000000" }}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          style={{ 
            display: "inline-block", 
            marginRight: char === " " ? "0.25em" : "0.05em",
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)"
          }}
          animate={{ 
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 2, 0, -2, 0],
            color: [
              "#000000", 
              index % 3 === 0 ? "#1e3c72" : index % 3 === 1 ? "#2a5298" : "#00BFFF", 
              "#000000"
            ]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            delay: index * 0.08,
            ease: "easeInOut" 
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Modal Component
function Modal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2 style={styles.modalTitle}>Feedback</h2>
        <p style={styles.modalText}>
          We value your feedback! Click the button below to open our feedback form.
        </p>
        <div style={styles.modalButtons}>
          <button 
            style={styles.modalButton}
            onClick={onConfirm}
          >
            Open Form
          </button>
          <button 
            style={{...styles.modalButton, background: "#6c757d"}}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Custom Flowing Menu Component
const FlowingMenuItem = ({ icon, label, isActive, onClick, delay = 0 }) => {
  return (
        <motion.div 
      className="flowing-menu-item"
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        transition: { 
          delay: delay,
          duration: 0.3
        }
      }}
      exit={{ opacity: 0, x: -20 }}
    >
      <motion.button
        style={{
          ...styles.flowingMenuItem,
          backgroundColor: isActive ? 'rgba(79, 172, 254, 0.15)' : 'transparent',
          borderLeft: isActive ? '3px solid #4FACFE' : '3px solid transparent'
        }}
        onClick={onClick}
        whileHover={{ 
          backgroundColor: "rgba(79, 172, 254, 0.1)",
          x: 5,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="icon-container" style={styles.iconContainer}>
          {icon}
        </div>
        <span style={styles.menuItemLabel}>{label}</span>
          <motion.div 
          style={styles.menuArrow}
          animate={{ 
            x: isActive ? 5 : 0,
            opacity: isActive ? 1 : 0.3,
          }}
        >
          <FiChevronRight size={14} color={isActive ? "#4FACFE" : "#6a8bad"} />
                </motion.div>
                </motion.button>
    </motion.div>
  );
};

// Content Card component for practice options
const PracticeOptionCard = ({ icon, title, description, onClick }) => {
  return (
    <motion.div 
      style={styles.practiceCard}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
        y: -5
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div style={styles.practiceIconWrapper}>
        {icon}
      </div>
      <h3 style={styles.practiceTitle}>{title}</h3>
      <p style={styles.practiceDescription}>{description}</p>
          </motion.div>
  );
};

// AI Feature component
const AIFeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div 
      style={styles.aiFeature}
      whileHover={{ 
        y: -3,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)"
      }}
    >
      <div style={styles.aiFeatureIcon}>
        {icon}
      </div>
      <div style={styles.featureContent}>
        <h3 style={styles.featureTitle}>{title}</h3>
        <p style={styles.featureDescription}>{description}</p>
    </div>
    </motion.div>
  );
};

// Define styles first, before the HomeScreen component
const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    minHeight: "100vh",
    width: "100%",
    color: "#fff",
    fontFamily: "'Exo', 'Inter', sans-serif",
    background: 'linear-gradient(to bottom, #040913, #010209)',
    overflow: 'hidden',
    position: 'relative',
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "clamp(1rem, 2vw, 1.5rem)",
    textAlign: "center",
    overflowY: 'auto',
    overflowX: 'hidden',
    wordWrap: 'break-word',
    hyphens: 'auto',
    maxWidth: '100%',
    minWidth: 0,
  },
  heading: {
    fontSize: "clamp(1.8rem, 6vw, 3rem)",
    fontWeight: "700",
    marginBottom: "clamp(0.75rem, 2vw, 1.5rem)",
    letterSpacing: "0.5px",
    textShadow: '0 0 20px rgba(79, 172, 254, 0.5)',
    background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    hyphens: 'auto',
    maxWidth: '100%',
    textAlign: 'center',
  },
  tagline: {
    fontSize: "clamp(0.95rem, 2.5vw, 1.3rem)",
    maxWidth: "min(800px, 90vw)",
    marginBottom: "clamp(2rem, 5vw, 3rem)",
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 1.6,
    fontWeight: "500",
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    hyphens: 'auto',
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    width: "100%",
    maxWidth: "min(1000px, 95vw)",
    gap: "clamp(1rem, 3vw, 1.5rem)",
    margin: "0 auto",
    '@media (max-width: 768px)': {
      flexDirection: "column",
      gap: "clamp(0.75rem, 3vw, 1rem)",
    },
  },
  optionCard: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "clamp(1.25rem, 3vw, 1.75rem)",
    borderRadius: "16px",
    background: "linear-gradient(135deg, rgba(42, 82, 152, 0.1), rgba(30, 60, 114, 0.2))",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#fff",
    transition: "all 0.3s ease",
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    minWidth: 0,
  },
  optionHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "1.5rem",
    width: "100%",
  },
  optionIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
  },
  optionTitle: {
    fontSize: "clamp(1.4rem, 4vw, 1.6rem)",
    fontWeight: "700",
    marginBottom: "clamp(0.4rem, 1vw, 0.6rem)",
    background: "linear-gradient(45deg, #fff, #87CEEB)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    textAlign: 'center',
    lineHeight: 1.2,
  },
  optionDescription: {
    fontSize: "clamp(0.95rem, 2.5vw, 1rem)",
    marginBottom: "clamp(1.25rem, 4vw, 1.75rem)",
    lineHeight: 1.5,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    textAlign: 'center',
  },
  practiceTypes: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
    width: "100%",
    marginBottom: "1.5rem",
    '@media (max-width: 768px)': {
      gridTemplateColumns: "1fr",
    },
  },
  practiceTypeButton: {
    padding: "1rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "0.5rem",
  },
  buttonIcon: {
    fontSize: "1.5rem",
    marginBottom: "0.5rem",
  },
  viewRulesButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "30px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "auto",
    transition: "all 0.2s ease",
  },
  aiFeaturesList: {
      width: "100%",
    listStyle: "none",
    padding: 0,
    margin: "0 0 2rem 0",
    textAlign: "left",
  },
  aiFeature: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
    fontSize: "1.05rem",
  },
  featureIcon: {
    fontSize: "1.2rem",
    filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))",
  },
  aiHelpButton: {
    padding: "1rem 2rem",
    backgroundColor: "rgba(0, 191, 255, 0.7)",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "auto",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 7000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
    color: "#000",
  },
  modalTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1rem",
  },
  modalText: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  modalButton: {
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  settingsToggle: {
    position: 'fixed',
    bottom: '2rem',
    left: '2rem',
    zIndex: 5000,
    cursor: 'pointer',
    fontSize: '2rem',
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'all 0.3s ease',
  },
  sidebar: {
    width: 'clamp(160px, 12vw, 180px)',
    minWidth: '140px',
    maxWidth: '180px',
    background: 'rgba(10, 25, 47, 0.98)',
    backdropFilter: 'blur(15px)',
    padding: 'clamp(0.5rem, 1vw, 0.75rem) 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRight: '1px solid rgba(255, 255, 255, 0.15)',
    overflowY: 'auto',
    overflowX: 'hidden',
    boxShadow: '1px 0 8px rgba(0, 0, 0, 0.4)',
    wordWrap: 'break-word',
  },
  sidebarContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '2rem',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  flowingMenuContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(0.25rem, 1vw, 0.4rem)',
    padding: '0 clamp(0.5rem, 1vw, 0.75rem)',
  },
  flowingMenuItem: {
    width: '100%',
    padding: 'clamp(0.5rem, 1.5vw, 0.65rem) clamp(0.6rem, 1.5vw, 0.8rem)',
    borderRadius: '6px',
    textAlign: 'left',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontWeight: '500',
    fontSize: 'clamp(0.8rem, 2vw, 0.85rem)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(0.4rem, 1vw, 0.6rem)',
    transition: 'all 0.2s ease',
    position: 'relative',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  menuItemLabel: {
    flex: 1,
  },
  menuArrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 'clamp(24px, 6vw, 28px)',
    height: 'clamp(24px, 6vw, 28px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    background: 'rgba(255, 255, 255, 0.08)',
    flexShrink: 0,
  },
  contentCard: {
    background: 'rgba(10, 25, 47, 0.5)',
    borderRadius: '16px',
    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    width: '100%',
    maxWidth: 'min(900px, 95vw)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
    flexWrap: 'wrap',
    gap: 'clamp(0.75rem, 2vw, 1.25rem)',
  },
  contentIconContainer: {
    width: 'clamp(40px, 8vw, 48px)',
    height: 'clamp(40px, 8vw, 48px)',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.15), rgba(0, 242, 254, 0.1))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 'clamp(0.75rem, 2vw, 1.25rem)',
    border: '1px solid rgba(79, 172, 254, 0.3)',
    flexShrink: 0,
  },
  contentIconSvg: {
    width: 'clamp(20px, 5vw, 24px)',
    height: 'clamp(20px, 5vw, 24px)',
    color: '#4FACFE',
  },
  contentTitle: {
    fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
    fontWeight: '700',
    background: 'linear-gradient(to right, #4facfe, #00f2fe)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    margin: 0,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    flex: 1,
    minWidth: 0,
  },
  contentDescription: {
    fontSize: 'clamp(1rem, 3vw, 1.1rem)',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 'clamp(1.5rem, 5vw, 2.5rem)',
    textAlign: 'left',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    lineHeight: 1.6,
  },
  practiceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(180px, 25vw, 220px), 1fr))',
    gap: 'clamp(1rem, 3vw, 1.5rem)',
    width: '100%',
    maxWidth: 'min(1000px, 95vw)',
  },
  practiceCard: {
    padding: 'clamp(1.25rem, 3vw, 1.75rem) clamp(1rem, 2.5vw, 1.5rem)',
    backgroundColor: 'rgba(20, 35, 60, 0.5)',
    color: '#fff',
    border: '1px solid rgba(79, 172, 254, 0.2)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    minHeight: '180px',
  },
  practiceIconWrapper: {
    width: 'clamp(48px, 12vw, 56px)',
    height: 'clamp(48px, 12vw, 56px)',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.15), rgba(0, 242, 254, 0.1))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'clamp(0.75rem, 2vw, 1.25rem)',
    border: '1px solid rgba(79, 172, 254, 0.3)',
    flexShrink: 0,
  },
  practiceIconSvg: {
    width: 'clamp(22px, 6vw, 26px)',
    height: 'clamp(22px, 6vw, 26px)',
    color: '#4FACFE',
  },
  practiceTitle: {
    fontSize: 'clamp(1rem, 3vw, 1.15rem)',
    fontWeight: '600',
    marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
    color: '#ffffff',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    lineHeight: 1.3,
  },
  practiceDescription: {
    fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
    lineHeight: 1.4,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  aiFeatureContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'clamp(1.5rem, 4vw, 2rem)',
    marginBottom: 'clamp(1.5rem, 5vw, 2.5rem)',
    width: '100%',
    justifyContent: 'center',
  },
  aiFeatureCol: {
    flex: '1 1 clamp(280px, 30vw, 320px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(1rem, 3vw, 1.5rem)',
    minWidth: 'clamp(220px, 25vw, 280px)',
  },
  aiFeature: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'clamp(1rem, 2.5vw, 1.25rem)',
    padding: 'clamp(1rem, 2.5vw, 1.25rem)',
    backgroundColor: 'rgba(20, 35, 60, 0.5)',
    borderRadius: '12px',
    border: '1px solid rgba(79, 172, 254, 0.15)',
    transition: 'all 0.3s ease',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  aiFeatureIcon: {
    width: 'clamp(44px, 10vw, 48px)',
    height: 'clamp(44px, 10vw, 48px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.15), rgba(0, 242, 254, 0.05))',
    padding: 'clamp(8px, 2vw, 10px)',
    border: '1px solid rgba(79, 172, 254, 0.2)',
    flexShrink: 0,
  },
  featureContent: {
    flex: 1,
    minWidth: 0,
  },
  featureTitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
    fontWeight: '600',
    margin: '0 0 clamp(0.25rem, 1vw, 0.5rem) 0',
    color: '#ffffff',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    lineHeight: 1.3,
  },
  featureDescription: {
    fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
    textAlign: 'left',
    lineHeight: '1.5',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  aiStartButton: {
    padding: 'clamp(0.9rem, 2.5vw, 1.1rem) clamp(1.5rem, 5vw, 2rem)',
    background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    color: '#010209',
    border: 'none',
    borderRadius: '8px',
    fontSize: 'clamp(0.95rem, 2.5vw, 1rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 15px rgba(79, 172, 254, 0.3)',
    display: 'block',
    margin: '0 auto',
    letterSpacing: '0.5px',
    minHeight: '44px',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  welcomeMessage: {
    background: 'rgba(10, 25, 47, 0.5)',
    borderRadius: '16px',
    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
    marginTop: 'clamp(1rem, 3vw, 2rem)',
    maxWidth: 'min(800px, 95vw)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  welcomeText: {
    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.85)',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  menuHeader: {
    padding: 'clamp(0.6rem, 1.5vw, 0.8rem) clamp(0.8rem, 2vw, 1rem)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
  },
  menuHeaderTitle: {
    margin: 0,
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    fontWeight: '600',
    background: 'linear-gradient(to right, #4facfe, #00f2fe)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    letterSpacing: '0.3px',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    textAlign: 'center',
  },
  // Mobile-specific styles
  mobileHeading: {
    fontSize: "clamp(1.5rem, 10vw, 2.2rem)",
    lineHeight: 1.2,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  mobileSidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 'clamp(200px, 60vw, 240px)',
    height: '100vh',
    zIndex: 1000,
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease',
    borderRadius: '0 8px 8px 0',
  },
  mobileSidebarOpen: {
    transform: 'translateX(0)',
  },
  mobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 999,
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(2px)',
  },
  mobileOverlayVisible: {
    opacity: 1,
    visibility: 'visible',
  },
  mobileMenuButton: {
    position: 'fixed',
    top: 'clamp(0.75rem, 3vw, 1rem)',
    left: 'clamp(0.75rem, 3vw, 1rem)',
    zIndex: 1001,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '8px',
    padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
    color: '#fff',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileMainContent: {
    marginLeft: 0,
    padding: "clamp(1rem, 4vw, 2rem)",
    width: '100%',
    overflowX: 'hidden',
  },
  mobileOptionsContainer: {
    flexDirection: "column",
    gap: "clamp(0.75rem, 3vw, 1rem)",
    alignItems: "stretch",
    width: '100%',
  },
  mobileCard: {
    padding: "clamp(1rem, 3vw, 1.5rem)",
    textAlign: "center",
    width: '100%',
  },
  mobilePracticeGrid: {
    gridTemplateColumns: "1fr",
    gap: "clamp(0.75rem, 3vw, 1rem)",
    width: '100%',
  },
  mobileAiFeatureContainer: {
    flexDirection: "column",
    gap: "clamp(0.75rem, 3vw, 1rem)",
    width: '100%',
  },
  mobileWelcomeText: {
    fontSize: "clamp(0.85rem, 3vw, 0.9rem)",
    lineHeight: 1.5,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
};

// HomeScreen Component
function HomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeContent, setActiveContent] = useState(null);
  const [menuOpen, setMenuOpen] = useState(true);
  const navigate = useNavigate();
  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.name || "");
        setUserEmail(decodedToken.email || "");
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserName("");
    setUserEmail("");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleFeedbackClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    window.open("https://your-feedback-form.com", "_blank");
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  // Set active content to display in main area
  const setActiveSidebarItem = (item) => {
    if (activeContent === item) {
      setActiveContent(null);
    } else {
      setActiveContent(item);
    }
  };

  // Navigate to practice screen with selected type
  const handlePractice = (type, defaultTopic = null) => {
    if (type === "Extemp") {
      navigate("/extemp", { 
        state: { type }
      });
    } else if (type === "Impromptu") {
      navigate("/topics", { 
        state: { type }
      });
    } else {
      navigate("/speech", { 
        state: { 
          topicName: defaultTopic || `Practice ${type} speech`,
          type 
        }
      });
    }
  };

  const handleChromaClick = () => {
    if (isLoggedIn) {
      navigate("/settings");
    } else {
      navigate("/login");
    }
  };

  // Flowing Menu items
  const menuItems = [
    { 
      id: 'practice', 
      icon: <FiTarget size={20} color={activeContent === 'practice' ? "#4FACFE" : "#6a8bad"} />, 
      label: 'Practice Speaking', 
      isActive: activeContent === 'practice',
      onClick: () => setActiveSidebarItem('practice')
    },
    { 
      id: 'ai-coach', 
      icon: <FiCpu size={20} color={activeContent === 'ai-coach' ? "#4FACFE" : "#6a8bad"} />, 
      label: 'AI Speech Coach', 
      isActive: activeContent === 'ai-coach',
      onClick: () => setActiveSidebarItem('ai-coach')
    }
  ];

  // Render practice content for the main area
  const renderPracticeContent = () => (
    <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={styles.contentCard}
    >
      <div style={styles.contentHeader}>
        <div style={styles.contentIconContainer}>
          <FiTarget style={styles.contentIconSvg} />
        </div>
        <h2 style={styles.contentTitle}>Practice Speaking</h2>
            </div>
            
      <p style={styles.contentDescription}>
              Choose a speech format and start practicing right away
            </p>
            
      <div style={isMobile ? {...styles.practiceGrid, ...styles.mobilePracticeGrid} : styles.practiceGrid}>
        <PracticeOptionCard 
          icon={<FiZap size={26} color="#4FACFE" />}
          title="Impromptu"
          description="Think on your feet with random topics"
                onClick={() => handlePractice("Impromptu")}
        />
        
        <PracticeOptionCard 
          icon={<FiBookOpen size={26} color="#4FACFE" />}
          title="Interp"
          description="Interpret and perform literature or poetry"
                onClick={() => handlePractice("Interp", "Choose a piece of literature, poem, or dramatic work to interpret")}
        />
        
        <PracticeOptionCard 
          icon={<FiEdit size={26} color="#4FACFE" />}
          title="Original"
          description="Present your own prepared speech"
                onClick={() => handlePractice("Original", "Present your original speech on a topic of your choice")}
        />
        
        <PracticeOptionCard 
          icon={<FiGlobe size={26} color="#4FACFE" />}
          title="Extemp"
          description="Present a speech with limited preparation"
                onClick={() => handlePractice("Extemp")}
        />
            </div>
          </motion.div>
  );
          
  // Render AI coach content for the main area
  const renderAICoachContent = () => (
          <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={styles.contentCard}
    >
      <div style={styles.contentHeader}>
        <div style={styles.contentIconContainer}>
          <FiCpu style={styles.contentIconSvg} />
        </div>
        <h2 style={styles.contentTitle}>AI Speech Coach</h2>
            </div>
            
      <p style={styles.contentDescription}>
              Get personalized feedback and analysis to improve your speaking skills
            </p>
            
      <div style={isMobile ? {...styles.aiFeatureContainer, ...styles.mobileAiFeatureContainer} : styles.aiFeatureContainer}>
        <div style={styles.aiFeatureCol}>
          <AIFeatureCard
            icon={<BsMicFill size={24} color="#4FACFE" />}
            title="Real-time Analysis"
            description="Get live feedback as you speak on pacing, tone, and clarity"
          />
          
          <AIFeatureCard
            icon={<BsBarChartFill size={24} color="#4FACFE" />}
            title="Performance Metrics" 
            description="Track key metrics like pace, filler words, and engagement"
          />
        </div>
        
        <div style={styles.aiFeatureCol}>
          <AIFeatureCard
            icon={<BsLightbulbFill size={24} color="#4FACFE" />}
            title="Personalized Tips"
            description="Receive custom advice tailored to your speaking style"
          />
          
          <AIFeatureCard
            icon={<BsArrowRepeat size={24} color="#4FACFE" />}
            title="Progress Tracking"
            description="Monitor your improvement over time with detailed reports"
          />
        </div>
      </div>
            
            <motion.button
        style={styles.aiStartButton}
              whileHover={{ scale: 1.05, backgroundColor: "#0077B6" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/ai-coach")}
            >
        Start AI Coaching Session
            </motion.button>
          </motion.div>
  );

  // Render welcome content for the main area
  const renderWelcomeContent = () => (
    <>
      <motion.h1
        style={isMobile ? {...styles.heading, ...styles.mobileHeading} : styles.heading}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {userName ? `Welcome, ${userName}` : "Welcome to Articulate"}
      </motion.h1>
      
      <motion.p 
        style={styles.tagline}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Improve your public speaking skills with practice and AI-powered feedback
      </motion.p>

      <motion.div
        style={styles.welcomeMessage}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <p style={isMobile ? {...styles.welcomeText, ...styles.mobileWelcomeText} : styles.welcomeText}>
          {isMobile ? "Select an option from the menu to get started with your speech practice or AI coaching session." : "Select an option from the sidebar to get started with your speech practice or AI coaching session. Articulate helps you become a more confident and effective public speaker through guided practice and intelligent feedback."}
        </p>
      </motion.div>
    </>
  );

  return (
    <>
      <div style={styles.container}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <motion.button
            style={styles.mobileMenuButton}
            onClick={() => setMenuOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open menu"
          >
            <FiArrowUp size={20} />
          </motion.button>
        )}

        {/* Mobile Overlay */}
        {isMobile && menuOpen && (
          <motion.div
            style={styles.mobileOverlay}
            onClick={() => setMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* Flowing Menu Sidebar */}
        <motion.div 
          style={{
            ...styles.sidebar,
            ...(isMobile ? {
              ...styles.mobileSidebar,
              ...(menuOpen ? styles.mobileSidebarOpen : {})
            } : {})
          }}
          initial={isMobile ? { x: -250 } : { x: -280 }}
          animate={isMobile ? { x: menuOpen ? 0 : -250 } : { x: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div style={styles.sidebarContent}>
            <div style={styles.menuHeader}>
              <h3 style={styles.menuHeaderTitle}>Articulate</h3>
              {isMobile && (
                <motion.button
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    padding: '0.25rem',
                  }}
                  onClick={() => setMenuOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close menu"
                >
                  ×
                </motion.button>
              )}
        </div>
            <nav style={styles.nav}>
              <motion.div 
                style={styles.flowingMenuContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {menuItems.map((item, index) => (
                  <FlowingMenuItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    isActive={item.isActive}
                    onClick={() => {
                      item.onClick();
                      if (isMobile) setMenuOpen(false);
                    }}
                    delay={0.1 * (index + 1)}
                  />
                ))}
              </motion.div>
            </nav>
      </div>
          <div 
            style={{
              zIndex: 101,
              cursor: 'pointer',
              padding: isMobile ? '0 1rem 1rem' : '0 1.5rem 1.5rem'
            }}
            onClick={() => {
              handleChromaClick();
              if (isMobile) setMenuOpen(false);
            }}
          >
            <ChromaGrid 
              isLoggedIn={isLoggedIn}
              userName={userName} 
              userEmail={userEmail}
            />
          </div>
        </motion.div>
        
        {/* Main Content Area */}
        <main style={{
          ...styles.mainContent,
          ...(isMobile ? styles.mobileMainContent : {})
        }}>
          <AnimatePresence mode="wait">
            {activeContent === 'practice' ? (
              renderPracticeContent()
            ) : activeContent === 'ai-coach' ? (
              renderAICoachContent()
            ) : (
              renderWelcomeContent()
            )}
          </AnimatePresence>
        </main>
    </div>
    </>
  );
}

export default HomeScreen;