import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import { useSpring, animated } from 'react-spring';
import { TypeAnimation } from 'react-type-animation';
import VisualBackground from "./VisualBackground";
import { useInterval, useMouse, useWindowSize } from 'react-use';

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

// Header Component with background toggle added to settings
function Header({ onFeedbackClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.name);
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserName("");
    setMenuOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <div style={styles.header}>
      <h1 style={styles.headerTitle}>ARTICULATE</h1>
      <div style={styles.settingsContainer}>
        <motion.div 
          style={styles.settingsIcon} 
          onClick={toggleMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ⚙️
        </motion.div>
        {menuOpen && (
          <motion.div 
            style={styles.settingsDropdown}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {userName ? (
              <>
                <motion.div style={styles.userName}>
                  {userName}
                </motion.div>
                <motion.button 
                  style={styles.dropdownButton} 
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Log Out
                </motion.button>
              </>
            ) : (
              <>
                <motion.button 
                  style={styles.dropdownButton} 
                  onClick={() => handleNavigation("/login")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
                <motion.button 
                  style={styles.dropdownButton} 
                  onClick={() => handleNavigation("/signup")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </>
            )}
            <motion.button 
              style={styles.dropdownButton} 
              onClick={() => { onFeedbackClick(); setMenuOpen(false); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Give Feedback
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Rules Display Component
const RulesDisplay = ({ isVisible, onClose, eventType }) => {
  const rulesContent = {
    Impromptu: {
      title: "Impromptu Rules",
      rules: [
        {
          title: "Time Limit",
          content: "You have 5 minutes to deliver your speech"
        },
        {
          title: "Preparation",
          content: "No preparation time - speak immediately after receiving your topic"
        },
        {
          title: "Structure",
          content: "Introduction, 2-3 main points, and conclusion recommended"
        },
        {
          title: "Topic Types",
          content: [
            "• Quotes - Interpret and discuss meaningful quotes",
            "• Abstract - Philosophical and conceptual topics",
            "• Concrete - Real-world subjects and scenarios",
            "• Current Events - Contemporary issues and news"
          ]
        },
        {
          title: "Scoring Criteria",
          content: [
            "• Content Development",
            "• Organization",
            "• Delivery",
            "• Language Use",
            "• Time Management"
          ]
        },
        {
          title: "Tips",
          content: [
            "• Stay calm and confident",
            "• Use personal experiences and examples",
            "• Maintain eye contact",
            "• Practice vocal variety",
            "• End with a strong conclusion"
          ]
        }
      ]
    },
    Interp: {
      title: "Interpretation Rules",
      rules: [
        {
          title: "Time Limit",
          content: "10 minutes maximum performance time"
        },
        {
          title: "Selection",
          content: "Choose from published prose, poetry, or dramatic literature"
        },
        {
          title: "Performance",
          content: "Develop character voices, gestures, and emotional connection"
        },
        {
          title: "Requirements",
          content: [
            "• Must use a published work",
            "• Clear distinction between characters",
            "• Maintain consistent character portrayal",
            "• Limited movement/gestures",
            "• No props or costumes allowed"
          ]
        },
        {
          title: "Scoring Criteria",
          content: [
            "• Character Development",
            "• Vocal Variety",
            "• Physical Presence",
            "• Interpretation Choices",
            "• Overall Impact"
          ]
        },
        {
          title: "Tips",
          content: [
            "• Choose material that resonates with you",
            "• Practice transitions between characters",
            "• Use varied vocal techniques",
            "• Connect with your audience",
            "• Tell the story authentically"
          ]
        }
      ]
    },
    Original: {
      title: "Original Speech Rules",
      rules: [
        {
          title: "Time Limit",
          content: "10 minutes maximum speech time"
        },
        {
          title: "Content",
          content: "Must be original content written by you"
        },
        {
          title: "Structure",
          content: "Clear introduction, body, and conclusion required"
        },
        {
          title: "Requirements",
          content: [
            "• Original research and writing",
            "• Proper citation of sources",
            "• Clear thesis statement",
            "• Supporting evidence",
            "• Persuasive argument"
          ]
        },
        {
          title: "Scoring Criteria",
          content: [
            "• Content Organization",
            "• Research Quality",
            "• Delivery Style",
            "• Persuasiveness",
            "• Overall Impact"
          ]
        },
        {
          title: "Tips",
          content: [
            "• Choose a passionate topic",
            "• Use credible sources",
            "• Practice delivery techniques",
            "• Engage your audience",
            "• End with a strong call to action"
          ]
        }
      ]
    },
    Extemp: {
      title: "Extemporaneous Rules",
      rules: [
        {
          title: "Time Limit",
          content: "7 minutes maximum speech time"
        },
        {
          title: "Preparation",
          content: "30 minutes prep time with access to research materials"
        },
        {
          title: "Structure",
          content: "Introduction, analysis points, and conclusion required"
        },
        {
          title: "Requirements",
          content: [
            "• Current events focus",
            "• Use of recent sources",
            "• Clear analysis",
            "• Supported arguments",
            "• Organized structure"
          ]
        },
        {
          title: "Scoring Criteria",
          content: [
            "• Analysis Depth",
            "• Source Usage",
            "• Organization",
            "• Delivery",
            "• Time Management"
          ]
        },
        {
          title: "Tips",
          content: [
            "• Stay updated on current events",
            "• Organize research effectively",
            "• Use specific examples",
            "• Practice time management",
            "• Develop clear analysis"
          ]
        }
      ]
    }
  };

  const currentRules = rulesContent[eventType];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={styles.rulesOverlay}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={styles.rulesContent}
            onClick={e => e.stopPropagation()}
          >
            <motion.h2 style={styles.rulesTitle}>{currentRules.title}</motion.h2>
            <motion.div style={styles.rulesList}>
              {currentRules.rules.map((rule, index) => (
                <motion.div 
                  key={index}
                  style={styles.ruleItem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3>{rule.title}</h3>
                  {Array.isArray(rule.content) ? (
                    rule.content.map((item, i) => (
                      <p key={i}>{item}</p>
                    ))
                  ) : (
                    <p>{rule.content}</p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// HomeScreen Component
function HomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState("Impromptu");
  const [userName, setUserName] = useState("");
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.name);
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  }, []);

  const handleFeedbackClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sections = [
    {
      id: "impromptu",
      title: "Impromptu",
      description: "Quick thinking, spontaneous speeches. 2 minutes",
      background: "linear-gradient(135deg, #1e3c72, #2a5298)",
      navigateTo: "/topics",
      icon: "⚡️",
      type: "Impromptu",
      onClick: () => {
        setSelectedEventType("Impromptu");
        setShowRules(true);
      },
      nextSection: "interp"
    },
    {
      id: "interp",
      title: "Interp",
      description: "Perform your own interpretation of a piece.",
      background: "linear-gradient(135deg, #6a11cb, #2575fc)",
      navigateTo: "/speech",
      icon: "🎭",
      type: "Interp",
      defaultTopic: "Choose a piece of literature, poem, or dramatic work to interpret",
      onClick: () => {
        setSelectedEventType("Interp");
        setShowRules(true);
      },
      nextSection: "original"
    },
    {
      id: "original",
      title: "Original",
      description: "Craft and present original content.",
      background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
      navigateTo: "/speech",
      icon: "✏️",
      type: "Original",
      defaultTopic: "Present your original speech on a topic of your choice",
      onClick: () => {
        setSelectedEventType("Original");
        setShowRules(true);
      },
      nextSection: "extemp"
    },
    {
      id: "extemp",
      title: "Extemp",
      description: "Speak on current events with depth.",
      background: "linear-gradient(135deg, #00c853, #00e676)",
      navigateTo: "/beta",
      icon: "🌎",
      type: "Extemp",
      onClick: () => {
        setSelectedEventType("Extemp");
        setShowRules(true);
      }
    },
  ];

  return (
    <div style={styles.container} ref={containerRef}>
      {/* Background - restored audio-reactive visualization */}
      <VisualBackground 
        colorMapping={{
          lowFreq: '#1e3c72',
          midFreq: '#2a5298',
          highFreq: '#00BFFF'
        }}
      />

      <Header 
        onFeedbackClick={handleFeedbackClick} 
      />

      {/* Welcome Screen */}
      <motion.div style={styles.welcomeScreen}>
        <motion.h1
          style={isMobile ? {...styles.heading, ...styles.mobileHeading} : styles.heading}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <FloatingText text={userName ? `Welcome to Speech App, ${userName}` : "Welcome to Speech App"} />
        </motion.h1>

        <motion.div 
          style={isMobile ? {...styles.downArrow, ...styles.mobileDownArrow} : styles.downArrow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0.4, 1, 0.4],
            y: [0, 10, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{
            scale: 1.2,
            rotate: [0, -10, 10, -10, 0],
            transition: { duration: 0.5 }
          }}
          onClick={() => scrollToSection(sections[0].id)}
        >
          <FiArrowDown size={isMobile ? 42 : 52.5} />
        </motion.div>
      </motion.div>

      {/* RulesDisplay component */}
      <RulesDisplay 
        isVisible={showRules} 
        onClose={() => setShowRules(false)} 
        eventType={selectedEventType}
      />

      {/* Full-page sections */}
      {sections.map((section, index) => (
        <motion.div
          key={section.id}
          id={section.id}
          style={isMobile ? 
            {...styles.fullPageSection, ...styles.mobileFullPageSection, background: section.background} : 
            {...styles.fullPageSection, background: section.background}
          }
          initial={{ opacity: 0 }}
          whileInView={{ 
            opacity: 1,
            transition: {
              duration: 0.8,
              staggerChildren: 0.2
            }
          }}
          viewport={{ once: false, amount: 0.3 }}
          onClick={section.onClick}
        >
          <motion.div 
            style={isMobile ? {...styles.sectionContent, ...styles.mobileSectionContent} : styles.sectionContent}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: isMobile ? 1.01 : 1.02,
              transition: { duration: 0.3 }
            }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div style={styles.sectionHeader}>
              <motion.div
                style={styles.sectionIcon}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                whileHover={{
                  scale: 1.2,
                  rotate: 360,
                  transition: { duration: 0.5 }
                }}
                transition={{ 
                  duration: 0.6,
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200
                }}
              >
                {section.icon}
              </motion.div>
              <motion.h2
                style={styles.sectionTitle}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{
                  scale: 1.05,
                  textShadow: "0 0 15px rgba(255,255,255,0.8)",
                  transition: { duration: 0.3 }
                }}
                transition={{ 
                  duration: 0.6,
                  delay: 0.4,
                  type: "spring",
                  stiffness: 100
                }}
              >
                {section.title}
              </motion.h2>
            </div>
            <motion.p
              style={styles.sectionDescription}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {section.description}
            </motion.p>
            <motion.button
              style={styles.ctaButton}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                delay: 0.6,
                type: "spring",
                stiffness: 200
              }}
              onClick={() => navigate(section.navigateTo, { 
                state: { 
                  topicName: section.defaultTopic || null,
                  type: section.type 
                }
              })}
            >
              <motion.span
                animate={{ 
                  x: [0, 5, 0],
                  textShadow: [
                    "0 0 5px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(255,255,255,0.8)",
                    "0 0 5px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                Begin Journey
              </motion.span>
              <motion.span 
                style={styles.buttonArrow}
                animate={{ 
                  x: [0, 8, 0],
                  opacity: [1, 0.6, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                →
              </motion.span>
            </motion.button>
            
            {/* Add navigation buttons */}
            {section.nextSection && (
              <motion.div
                style={styles.centeredNavButton}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{
                  scale: 1.2,
                  rotate: [0, -5, 5, -5, 0],
                  transition: { duration: 0.5 }
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering section's onClick
                  scrollToSection(section.nextSection);
                }}
              >
                <FiArrowDown size={30} />
              </motion.div>
            )}
            
            {section.id === "extemp" && (
              <motion.div
                style={styles.centeredNavButton}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{
                  scale: 1.2,
                  rotate: [0, -5, 5, -5, 0],
                  transition: { duration: 0.5 }
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering section's onClick
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <FiArrowUp size={30} />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      ))}

      <Modal isOpen={isModalOpen} onClose={handleClose} onConfirm={handleConfirm} />
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    color: "#fff",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    overflow: "auto",
    WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
  },
  particles: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -2,
  },
  parallaxLayer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    zIndex: -1,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "clamp(0.5rem, 2vw, 2rem)",
    background: "rgba(30, 60, 114, 0.95)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 4000,
    borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
    '@media (max-width: 768px)': {
      padding: "0.8rem 1rem",
      justifyContent: "flex-end"
    }
  },
  headerTitle: {
    fontSize: "clamp(1.2rem, 5vw, 2rem)",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
    letterSpacing: "2px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    background: "linear-gradient(45deg, #fff, #87CEEB)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "glow 2s ease-in-out infinite alternate",
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  settingsContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginRight: "4rem",
    marginLeft: "auto",
    zIndex: 5000,
  },
  settingsIcon: {
    fontSize: "24px",
    cursor: "pointer",
    marginLeft: "15px",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  settingsDropdown: {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    padding: "1rem",
    width: "200px",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
  },
  userName: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#333",
    padding: "0.5rem",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    marginBottom: "0.5rem",
  },
  dropdownButton: {
    padding: "0.5rem 1rem",
    fontSize: "0.9rem",
    fontWeight: "500",
    width: "100%",
    border: "none",
    borderRadius: "8px",
    background: "rgba(255, 255, 255, 0.1)",
    color: "#333",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(0, 0, 0, 0.05)",
    },
  },
  welcomeScreen: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    padding: "clamp(1rem, 5vw, 3rem)",
    textAlign: "center",
    position: "relative",
    marginTop: "clamp(60px, 10vh, 80px)",
    '@media (max-width: 768px)': {
      marginTop: "60px",
      padding: "1rem",
    },
  },
  heading: {
    fontSize: "clamp(2rem, 8vw, 3.5rem)",
    fontWeight: "700",
    marginBottom: "1rem",
    letterSpacing: "2px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
    color: "#000000",
  },
  navDots: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    padding: "1rem",
    borderRadius: "20px",
  },
  navDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
    "&:hover": {
      backgroundColor: "#fff",
      transform: "scale(1.2)",
      border: "2px solid rgba(255, 255, 255, 0.5)",
    }
  },
  downArrow: {
    fontSize: "3rem",
    marginTop: "2rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: "#000",
    animation: "bounce 4s infinite ease-in-out",
    filter: "drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))",
    "&:hover": {
      transform: "scale(1.2)",
    }
  },
  "@keyframes bounce": {
    "0%": {
      transform: "translateY(0)",
    },
    "20%": {
      transform: "translateY(-80px)",
    },
    "30%": {
      transform: "translateY(-40px)",
    },
    "40%": {
      transform: "translateY(-100px)",
    },
    "50%": {
      transform: "translateY(-60px)",
    },
    "60%": {
      transform: "translateY(-90px)",
    },
    "70%": {
      transform: "translateY(-30px)",
    },
    "80%": {
      transform: "translateY(-70px)",
    },
    "90%": {
      transform: "translateY(-20px)",
    },
    "100%": {
      transform: "translateY(0)",
    }
  },
  "@keyframes gradientText": {
    "0%": {
      backgroundPosition: "0% 50%",
      backgroundSize: "200% 200%",
    },
    "50%": {
      backgroundPosition: "100% 50%",
      backgroundSize: "200% 200%",
    },
    "100%": {
      backgroundPosition: "0% 50%",
      backgroundSize: "200% 200%",
    }
  },
  "@keyframes glow": {
    "from": {
      textShadow: "0 0 10px #fff, 0 0 20px #87CEEB, 0 0 30px #1E90FF",
    },
    "to": {
      textShadow: "0 0 20px #fff, 0 0 30px #87CEEB, 0 0 40px #1E90FF",
    }
  },
  fullPageSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    padding: "clamp(1rem, 5vw, 3rem)",
    textAlign: "center",
    position: "relative",
    transition: "transform 0.3s ease",
    '@media (hover: hover)': {
      "&:hover": {
        transform: "scale(1.02)",
      },
    },
    '@media (max-width: 768px)': {
      padding: "2rem 1rem",
      minHeight: "auto",
      marginBottom: "2rem",
    },
  },
  sectionContent: {
    maxWidth: "min(800px, 90%)",
    width: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "clamp(10px, 2vw, 20px)",
    padding: "clamp(1rem, 4vw, 2rem)",
    '@media (max-width: 768px)': {
      width: "95%",
      padding: "1.5rem",
    },
  },
  sectionHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-10px",
      width: "50%",
      height: "2px",
      background: "linear-gradient(90deg, transparent, #fff, transparent)",
    }
  },
  sectionIcon: {
    fontSize: "clamp(2.5rem, 8vw, 4rem)",
    marginBottom: "clamp(0.5rem, 2vw, 1rem)",
    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
    display: "inline-block",
  },
  sectionTitle: {
    fontSize: "clamp(1.2rem, 5vw, 3rem)",
    fontWeight: "700",
    marginBottom: "clamp(0.5rem, 2vw, 1rem)",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    background: "linear-gradient(45deg, #fff, #87CEEB)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  sectionDescription: {
    fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
    maxWidth: "100%",
    lineHeight: "1.6",
    marginBottom: "clamp(1rem, 3vw, 1.5rem)",
    padding: "0 clamp(0.5rem, 2vw, 1rem)",
  },
  ctaButton: {
    padding: "clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)",
    fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
    fontWeight: "600",
    width: "fit-content",
    minWidth: "150px",
    border: "none",
    borderRadius: "clamp(8px, 2vw, 15px)",
    background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(5px)",
    border: "1px solid rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    margin: "0 auto",
    position: "relative",
    overflow: "hidden",
    '@media (hover: hover)': {
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
      },
    },
    '@media (max-width: 768px)': {
      width: "100%",
      maxWidth: "300px",
    },
  },
  buttonArrow: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    filter: "drop-shadow(0 0 5px rgba(255,255,255,0.5))",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(5px)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "clamp(8px, 2vw, 12px)",
    padding: "clamp(1rem, 4vw, 1.5rem)",
    width: "min(90%, 450px)",
    margin: "1rem",
    textAlign: "center",
    boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    '@media (max-width: 768px)': {
      width: "95%",
      margin: "0.5rem",
    },
  },
  modalTitle: {
    fontSize: "clamp(1.2rem, 5vw, 1.8rem)",
    marginBottom: "1rem",
    fontWeight: "bold",
    color: "#333",
  },
  modalText: {
    fontSize: "clamp(0.8rem, 3vw, 1rem)",
    marginBottom: "1.5rem",
    color: "#555",
    lineHeight: "1.5",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "clamp(0.5rem, 2vw, 1rem)",
    flexWrap: "wrap",
    '@media (max-width: 768px)': {
      flexDirection: "column",
      gap: "0.5rem",
    },
  },
  modalButton: {
    padding: "clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)",
    fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
    minWidth: "120px",
    '@media (max-width: 768px)': {
      width: "100%",
    },
  },
  modalButtonCancel: {
    padding: "clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)",
    fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
    minWidth: "120px",
    '@media (max-width: 768px)': {
      width: "100%",
    },
  },
  '@media (hover: none)': {
    ctaButton: {
      "&:active": {
        transform: "scale(0.98)",
      },
    },
    navDot: {
      "&:active": {
        backgroundColor: "#fff",
        transform: "scale(1.2)",
      },
    },
  },
  card: {
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "2rem",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    transition: "all 0.3s ease",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  featureCard: {
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "2rem",
    borderRadius: "15px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    textAlign: "center",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  testimonialCard: {
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "2rem",
    borderRadius: "15px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    textAlign: "center",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  pricingCard: {
    background: 'rgba(42, 82, 152, 0.95)',
    padding: "2rem",
    borderRadius: "15px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    textAlign: "center",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
  rulesOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(30, 60, 114, 0.97)",
    zIndex: 5000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    overflow: "auto",
  },
  rulesContent: {
    width: "100%",
    maxWidth: "1000px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    padding: "2rem",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },
  rulesTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "2rem",
    textAlign: "center",
    background: "linear-gradient(45deg, #fff, #87CEEB)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  rulesList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
    padding: "1rem",
  },
  ruleItem: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "1.5rem",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    "& h3": {
      fontSize: "1.2rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "#87CEEB",
    },
    "& p": {
      fontSize: "1rem",
      lineHeight: "1.6",
      marginBottom: "0.5rem",
    },
  },
  toggleButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    background: 'rgba(30, 60, 114, 0.8)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 15px',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    backdropFilter: 'blur(5px)',
  },
  welcomeToggleButton: {
    background: 'rgba(30, 60, 114, 0.8)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    backdropFilter: 'blur(5px)',
    marginTop: '20px',
    marginBottom: '30px',
    zIndex: 100,
  },
  centeredNavButton: {
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(5px)",
    cursor: "pointer",
    color: "#000",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 10,
    transition: "all 0.3s ease",
    marginTop: "30px",
    alignSelf: "center",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.4)",
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
    }
  },
  // Add new styles for the enhanced disclaimer modal
  disclaimerContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 5000,
    perspective: 1000,
  },
  customModalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.7)",
    zIndex: 5000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    perspective: 1000,
  },
  customModalContent: {
    width: "min(90%, 500px)",
    background: "rgba(30, 60, 114, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "clamp(1.5rem, 4vw, 2.5rem)",
    color: "#fff",
    border: "1px solid rgba(54, 214, 231, 0.3)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.5rem",
  },
  customModalTitle: {
    fontSize: "clamp(1.5rem, 5vw, 2rem)",
    fontWeight: "700",
    background: "linear-gradient(135deg, #fff, #36D6E7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    marginBottom: "0.5rem",
    filter: "drop-shadow(0 0 5px rgba(54, 214, 231, 0.5))",
  },
  customModalText: {
    fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
    lineHeight: "1.6",
    textAlign: "center",
    maxWidth: "100%",
  },
  customModalButtons: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem",
    width: "100%",
  },
  customModalButton: {
    padding: "0.75rem 2rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#fff",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    outline: "none",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(54, 214, 231, 0.5)",
    transition: "all 0.3s ease",
    minWidth: "200px",
    position: "relative",
    overflow: "hidden",
  },
  modalIconContainer: {
    position: "relative",
    width: "80px",
    height: "80px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "1rem",
  },
  modalIcon: {
    fontSize: "2.5rem",
    color: "#fff",
    filter: "drop-shadow(0 0 8px rgba(54, 214, 231, 0.8))",
    zIndex: 1,
  },
  iconRing: {
    position: "absolute",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "2px solid rgba(54, 214, 231, 0.5)",
    animation: "pulse 2s infinite ease-in-out",
  },
  iconRing2: {
    position: "absolute",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "2px solid rgba(54, 214, 231, 0.3)",
    animation: "pulse 2s infinite ease-in-out 0.5s",
  },
  privacyBadge: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "rgba(0, 191, 255, 0.2)",
    borderRadius: "30px",
    fontSize: "0.9rem",
    color: "#fff",
    fontWeight: "500",
    borderLeft: "3px solid #00BFFF",
  },
  highlightBox: {
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    padding: "1rem",
    margin: "1rem 0",
    border: "1px solid rgba(54, 214, 231, 0.3)",
  },
  securityFeatures: {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
    margin: "1rem 0",
    gap: "1rem",
    flexWrap: "wrap",
  },
  securityFeature: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
    flex: "1 1 28%",
    textAlign: "center",
  },
  featureIcon: {
    fontSize: "1.5rem",
    marginBottom: "0.25rem",
    filter: "drop-shadow(0 0 5px rgba(54, 214, 231, 0.5))",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem",
    width: "100%",
  },
  modalButton: {
    padding: "0.75rem 2rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#fff",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    outline: "none",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(54, 214, 231, 0.5)",
    transition: "all 0.3s ease",
    minWidth: "200px",
    position: "relative",
    overflow: "hidden",
  },
  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
      opacity: 1,
    },
    "50%": {
      transform: "scale(1.2)",
      opacity: 0.5,
    },
    "100%": {
      transform: "scale(1)",
      opacity: 1,
    },
  },
  "@keyframes shineEffect": {
    "0%": {
      left: "-100%",
    },
    "100%": {
      left: "100%",
    },
  },
  // Mobile responsive styles
  mobileWelcomeScreen: {
    padding: '1rem',
    minHeight: '90vh', // Adjust for mobile viewports
  },
  mobileHeading: {
    fontSize: 'clamp(2rem, 8vw, 3rem)',
    marginBottom: '1rem',
  },
  mobileDownArrow: {
    fontSize: '2.5rem',
    marginTop: '1rem',
  },
  mobileFullPageSection: {
    minHeight: '85vh', // Shorter for mobile
    padding: '1rem',
  },
  mobileSectionContent: {
    width: '95%',
    padding: '1rem',
  },
  mobileHeader: {
    padding: '0.5rem 1rem',
  },
  mobileSettingsDropdown: {
    right: '5px',
    width: '180px',
  },
  mobileModal: {
    width: '90%',
    padding: '1rem',
  },
};

export default HomeScreen;