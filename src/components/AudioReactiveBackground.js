import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useInterval } from 'react-use';

const AudioReactiveBackground = ({ colorMapping = {
  lowFreq: '#1e3c72',
  midFreq: '#2a5298',
  highFreq: '#00BFFF'
} }) => {
  const canvasRef = useRef(null);
  const [visualizerData, setVisualizerData] = useState([]);
  
  // Generate visualization data without actual audio input
  const generateVisualizationData = () => {
    const time = Date.now() * 0.001;
    const data = Array(128).fill(0).map((_, i) => {
      // Create a wave pattern based on time and position
      const frequency = i / 128; // normalized frequency
      
      // Generate various wave patterns with more variation
      const wave1 = Math.sin(time * 2.5 + frequency * 10) * 0.5 + 0.5;
      const wave2 = Math.sin(time * 1.3 + frequency * 20) * 0.5 + 0.5;
      const wave3 = Math.sin(time * 0.7 + frequency * 5) * 0.5 + 0.5;
      
      // Combine waves and scale to 0-255 range with more intensity
      return Math.floor(((wave1 * wave2 + wave3) / 2) * 200);
    });
    
    setVisualizerData(data);
  };

  // Update visualization data at regular intervals
  useInterval(() => {
    generateVisualizationData();
  }, 30);

  // Draw three.js visualization
  useEffect(() => {
    if (!canvasRef.current || visualizerData.length === 0) return;

    // Create scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Create visualizations
    const createVisualizations = () => {
      // Clear existing objects from scene
      while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
      }
      
      // Enhanced color palette for more vibrancy
      const dynamicColors = {
        lowFreq: new THREE.Color(colorMapping.lowFreq),
        midFreq: new THREE.Color(colorMapping.midFreq),
        highFreq: new THREE.Color(colorMapping.highFreq),
        // Additional colors for more variety
        accent1: new THREE.Color('#FF5E7D'), // Pink
        accent2: new THREE.Color('#36D6E7'), // Cyan
        accent3: new THREE.Color('#FFDD4A'), // Yellow
        accent4: new THREE.Color('#7C4DFF')  // Purple
      };
      
      // Time-based hue shift for dynamic colors
      const time = Date.now() * 0.001;
      const hueShift = (Math.sin(time * 0.2) + 1) * 0.5; // 0-1 range
      
      // Create outer ring bars
      const bars = [];
      const totalBars = Math.min(64, visualizerData.length); // Limit to 64 bars for performance
      
      for (let i = 0; i < totalBars; i++) {
        // Calculate frequency range (0-1) where 0 is lowest frequency and 1 is highest
        const freqRange = i / totalBars;
        
        // More dynamic color selection based on frequency and time
        let color;
        if (freqRange < 0.25) {
          color = dynamicColors.lowFreq.clone().lerp(dynamicColors.accent3, hueShift);
        } else if (freqRange < 0.5) {
          color = dynamicColors.midFreq.clone().lerp(dynamicColors.accent1, hueShift);
        } else if (freqRange < 0.75) {
          color = dynamicColors.highFreq.clone().lerp(dynamicColors.accent2, hueShift);
        } else {
          color = dynamicColors.accent4.clone().lerp(dynamicColors.highFreq, hueShift);
        }

        // Create bar geometry and material
        const geometry = new THREE.BoxGeometry(2, 1, 1);
        const material = new THREE.MeshBasicMaterial({ 
          color: color,
          transparent: true,
          opacity: 0.8
        });
        
        // Create mesh and position it
        const bar = new THREE.Mesh(geometry, material);
        const angle = (i / totalBars) * Math.PI * 2; // Position in a circle
        const radius = 40;
        
        bar.position.x = Math.cos(angle) * radius;
        bar.position.y = Math.sin(angle) * radius;
        bar.rotation.z = angle;
        
        // Scale based on frequency data
        const value = visualizerData[i] || 0;
        const normalizedValue = value / 255; // Normalize to 0-1
        bar.scale.y = 1 + normalizedValue * 30; // Scale the bar based on animation intensity
        
        scene.add(bar);
        bars.push(bar);
      }
      
      // Create inner frequency wave with more vibrant colors
      const wavePoints = [];
      const waveSegments = 128; // Number of segments in the wave
      const waveRadius = 25; // Smaller inner radius
      
      for (let i = 0; i <= waveSegments; i++) {
        const angle = (i / waveSegments) * Math.PI * 2;
        // Sample from visualization data (wrap around if needed)
        const dataIndex = Math.floor((i / waveSegments) * visualizerData.length) % visualizerData.length;
        const value = visualizerData[dataIndex] || 0;
        const normalizedValue = value / 255;
        
        // Calculate point position with frequency-based displacement
        const radius = waveRadius + normalizedValue * 10;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = normalizedValue * 5; // Add some depth based on animation intensity
        
        wavePoints.push(new THREE.Vector3(x, y, z));
      }
      
      // Create curve from points (close the loop)
      wavePoints.push(wavePoints[0].clone());
      const waveCurve = new THREE.CatmullRomCurve3(wavePoints);
      
      // Create tube geometry from curve
      const waveGeometry = new THREE.TubeGeometry(waveCurve, 128, 1.5, 8, true);
      
      // Create gradient material with more colors
      const waveColors = [
        dynamicColors.lowFreq,
        dynamicColors.accent1,
        dynamicColors.midFreq,
        dynamicColors.accent2,
        dynamicColors.highFreq,
        dynamicColors.accent4,
        dynamicColors.accent3
      ];
      
      // Create color attribute
      const colorCount = waveGeometry.attributes.position.count;
      const colors = new Float32Array(colorCount * 3);
      
      for (let i = 0; i < colorCount; i++) {
        // Create color gradient along the tube with time influence
        const t = (i / colorCount + hueShift) % 1;
        const colorIndex = Math.floor(t * waveColors.length);
        const nextColorIndex = (colorIndex + 1) % waveColors.length;
        const colorT = (t * waveColors.length) % 1;
        
        const color = new THREE.Color().lerpColors(
          waveColors[colorIndex],
          waveColors[nextColorIndex],
          colorT
        );
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }
      
      waveGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      // Create mesh with vertex colors
      const waveMaterial = new THREE.MeshBasicMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        wireframe: false
      });
      
      const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
      scene.add(waveMesh);
      
      // Create multiple glowing spheres at the center
      const glowMeshes = [];
      const glowColors = [
        dynamicColors.accent1,
        dynamicColors.accent2,
        dynamicColors.highFreq
      ];
      
      // Pulse the glow based on average animation intensity
      const avgIntensity = visualizerData.reduce((sum, val) => sum + val, 0) / visualizerData.length / 255;
      
      // Create 3 overlapping glowing spheres
      for (let i = 0; i < glowColors.length; i++) {
        const glowGeometry = new THREE.SphereGeometry(4 + i, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: glowColors[i],
          transparent: true,
          opacity: 0.5 + avgIntensity * 0.3,
        });
        
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        // Slightly offset each sphere
        glowMesh.position.x = Math.sin(time * (i + 1)) * 2;
        glowMesh.position.y = Math.cos(time * (i + 1)) * 2;
        
        // Different scale for each sphere
        const scale = 1 + avgIntensity * (2 + i * 0.5);
        glowMesh.scale.set(scale, scale, scale);
        
        scene.add(glowMesh);
        glowMeshes.push({
          mesh: glowMesh,
          geometry: glowGeometry,
          material: glowMaterial
        });
      }
      
      // Add many more colorful stars/particles
      const starsGeometry = new THREE.BufferGeometry();
      const starCount = 300;
      const starPositions = new Float32Array(starCount * 3);
      const starSizes = new Float32Array(starCount);
      const starColors = new Float32Array(starCount * 3);
      
      for (let i = 0; i < starCount; i++) {
        // Random position in sphere
        const radius = 150 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        starPositions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Use visualization data to determine star size if available
        const dataIndex = i % visualizerData.length;
        const value = visualizerData[dataIndex] || 0;
        const normalizedValue = value / 255;
        
        starSizes[i] = 0.5 + normalizedValue * 3;
        
        // Assign random colors from our palette to stars
        const colorKeys = Object.keys(dynamicColors);
        const randomColor = dynamicColors[colorKeys[i % colorKeys.length]];
        
        starColors[i * 3] = randomColor.r;
        starColors[i * 3 + 1] = randomColor.g;
        starColors[i * 3 + 2] = randomColor.b;
      }
      
      starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      starsGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
      starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
      
      // Use vertex colors for stars
      const starsMaterial = new THREE.PointsMaterial({
        size: 1.5,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending
      });
      
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      
      return { 
        bars, 
        waveMesh, 
        waveGeometry, 
        waveMaterial, 
        glowMeshes,
        stars, 
        starsGeometry, 
        starsMaterial 
      };
    };
    
    // Initial creation of visualizations
    const visualObjects = createVisualizations();
    
    // Animation variables
    let animationFrameId;
    let rotationAngle = 0;
    
    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Rotate camera around scene
      rotationAngle += 0.001;
      camera.position.x = Math.sin(rotationAngle) * 120;
      camera.position.z = Math.cos(rotationAngle) * 120;
      camera.lookAt(scene.position);
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    // Start animation loop
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      
      // Clean up visual objects
      scene.remove(visualObjects.waveMesh);
      visualObjects.waveGeometry.dispose();
      visualObjects.waveMaterial.dispose();
      
      // Clean up glow meshes
      visualObjects.glowMeshes.forEach(glow => {
        scene.remove(glow.mesh);
        glow.geometry.dispose();
        glow.material.dispose();
      });
      
      scene.remove(visualObjects.stars);
      visualObjects.starsGeometry.dispose();
      visualObjects.starsMaterial.dispose();
      
      visualObjects.bars.forEach(bar => {
        scene.remove(bar);
        bar.geometry.dispose();
        bar.material.dispose();
      });
      
      renderer.dispose();
    };
  }, [visualizerData, colorMapping]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%' }} 
      />
    </div>
  );
};

export default AudioReactiveBackground; 