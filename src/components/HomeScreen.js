import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import { useSpring, animated } from 'react-spring';
import { TypeAnimation } from 'react-type-animation';
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

// Define styles first, before the HomeScreen component
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
  // Additional styles for the new layout
  mainContent: {
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
  },
  tagline: {
    fontSize: "clamp(1rem, 3vw, 1.5rem)",
    maxWidth: "800px",
    marginBottom: "3rem",
    color: "#000",
    lineHeight: 1.6,
    fontWeight: "500",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    width: "100%",
    maxWidth: "1200px",
    gap: "2rem",
    margin: "0 auto",
    '@media (max-width: 768px)': {
      flexDirection: "column",
      gap: "1.5rem",
    },
  },
  optionCard: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "2rem",
    borderRadius: "20px",
    background: "linear-gradient(135deg, rgba(42, 82, 152, 0.8), rgba(30, 60, 114, 0.8))",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#fff",
    transition: "all 0.3s ease",
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
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
    background: "linear-gradient(45deg, #fff, #87CEEB)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  optionDescription: {
    fontSize: "1.1rem",
    marginBottom: "2rem",
    lineHeight: 1.6,
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
  rulesOverlay: undefined,
  rulesContent: undefined,
  rulesTitle: undefined, 
  rulesList: undefined,
  ruleItem: undefined,
};

// HomeScreen Component
function HomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
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

  // Navigate to practice screen with selected type
  const handlePractice = (type, defaultTopic = null) => {
    if (type === "Extemp") {
      navigate("/beta", { 
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

  return (
    <div style={{...styles.container, backgroundColor: "#ffffff"}}>
      {/* Background visualization removed for solid white background */}

      <Header onFeedbackClick={handleFeedbackClick} />

      {/* Main Content */}
      <div style={styles.mainContent}>
        <motion.h1
          style={isMobile ? {...styles.heading, ...styles.mobileHeading} : styles.heading}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <FloatingText text={userName ? `Welcome to Articulate, ${userName}` : "Welcome to Articulate"} />
        </motion.h1>
        
        <motion.p 
          style={{
            fontSize: "1.2rem",
            maxWidth: "800px",
            margin: "0 auto 3rem auto",
            color: "#000",
            lineHeight: 1.6
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Improve your public speaking skills with practice and AI-powered feedback
        </motion.p>

        {/* Two Main Options */}
        <div style={{
    display: "flex",
          flexDirection: isMobile ? "column" : "row",
    justifyContent: "center",
          alignItems: "stretch",
          width: "100%",
          maxWidth: "1200px",
          gap: "2rem",
          margin: "0 auto"
        }}>
          {/* Practice Option */}
          <motion.div 
            style={{
              flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "2rem",
              borderRadius: "20px",
              background: "linear-gradient(135deg, rgba(42, 82, 152, 0.8), rgba(30, 60, 114, 0.8))",
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#fff"
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)"
            }}
          >
            <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
              marginBottom: "1.5rem"
            }}>
              <span style={{
                fontSize: "3rem",
                marginBottom: "1rem"
              }}>🎯</span>
              <h2 style={{
                fontSize: "1.8rem",
    fontWeight: "700",
                marginBottom: "0.5rem",
    background: "linear-gradient(45deg, #fff, #87CEEB)",
    WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Practice Speaking</h2>
            </div>
            
            <p style={{
              fontSize: "1.1rem",
              marginBottom: "2rem",
              textAlign: "center"
            }}>
              Choose a speech format and start practicing right away
            </p>
            
            {/* Practice Options */}
            <div style={{
    display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: "1rem",
              width: "100%",
              marginBottom: "1.5rem"
            }}>
              <motion.button 
                style={{
    padding: "1rem",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  fontSize: "1rem",
      fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "0.5rem"
                }}
                whileHover={{ scale: 1.05, backgroundColor: "#1e3c72" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePractice("Impromptu")}
              >
                <span style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⚡️</span>
                Impromptu
              </motion.button>
              
              <motion.button 
                style={{
                  padding: "1rem",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
      fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
                  flexDirection: "column",
                  gap: "0.5rem"
                }}
                whileHover={{ scale: 1.05, backgroundColor: "#6a11cb" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePractice("Interp", "Choose a piece of literature, poem, or dramatic work to interpret")}
              >
                <span style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🎭</span>
                Interp
              </motion.button>
              
              <motion.button 
                style={{
                  padding: "1rem",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
    cursor: "pointer",
    display: "flex",
                  alignItems: "center",
    justifyContent: "center",
                  flexDirection: "column",
                  gap: "0.5rem"
                }}
                whileHover={{ scale: 1.05, backgroundColor: "#ff416c" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePractice("Original", "Present your original speech on a topic of your choice")}
              >
                <span style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>✏️</span>
                Original
              </motion.button>
              
              <motion.button 
                style={{
                  padding: "1rem",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
    alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "0.5rem"
                }}
                whileHover={{ scale: 1.05, backgroundColor: "#00c853" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePractice("Extemp")}
              >
                <span style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🌎</span>
                Extemp
              </motion.button>

              <motion.button 
                style={{
                  padding: "1rem",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "0.5rem"
                }}
                whileHover={{ scale: 1.05, backgroundColor: "#1e3c72" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/speech-tutoring")}
              >
                <span style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>👥</span>
                Speech Tutoring
              </motion.button>
            </div>
          </motion.div>
          
          {/* AI Help Option */}
          <motion.div 
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "2rem",
    borderRadius: "20px",
              background: "linear-gradient(135deg, rgba(0, 119, 182, 0.8), rgba(0, 180, 216, 0.8))",
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#fff"
            }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)"
            }}
          >
            <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
              marginBottom: "1.5rem"
            }}>
              <span style={{
                fontSize: "3rem",
                marginBottom: "1rem"
              }}>🤖</span>
              <h2 style={{
                fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
                background: "linear-gradient(45deg, #fff, #87CEEB)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>AI Speech Coach</h2>
            </div>
            
            <p style={{
              fontSize: "1.1rem",
              marginBottom: "2rem",
              textAlign: "center"
            }}>
              Get personalized feedback and analysis to improve your speaking skills
            </p>
            
            <ul style={{
    width: "100%",
              listStyle: "none",
              padding: 0,
              margin: "0 0 2rem 0",
              textAlign: "left"
            }}>
              <li style={{
    display: "flex",
    alignItems: "center",
                gap: "1rem",
    marginBottom: "1rem",
                fontSize: "1.05rem"
              }}>
                <span style={{ fontSize: "1.2rem" }}>🎤</span>
                <span>Real-time speech analysis</span>
              </li>
              <li style={{
    display: "flex",
    alignItems: "center",
    gap: "1rem",
                marginBottom: "1rem",
                fontSize: "1.05rem"
              }}>
                <span style={{ fontSize: "1.2rem" }}>📊</span>
                <span>Detailed performance metrics</span>
              </li>
              <li style={{
    display: "flex",
    alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
                fontSize: "1.05rem"
              }}>
                <span style={{ fontSize: "1.2rem" }}>💡</span>
                <span>Personalized improvement tips</span>
              </li>
              <li style={{
    display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
                fontSize: "1.05rem"
              }}>
                <span style={{ fontSize: "1.2rem" }}>🔄</span>
                <span>Progress tracking over time</span>
              </li>
            </ul>
            
            <motion.button
              style={{
                padding: "1rem 2rem",
                backgroundColor: "rgba(0, 191, 255, 0.7)",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
                fontSize: "1.1rem",
                fontWeight: "600",
    cursor: "pointer",
                alignSelf: "center",
                marginTop: "auto",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              whileHover={{ scale: 1.05, backgroundColor: "#0077B6" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/ai-coach")}
            >
              Start AI Coaching <span style={{ marginLeft: '8px' }}>→</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose} onConfirm={handleConfirm} />
    </div>
  );
}

export default HomeScreen;