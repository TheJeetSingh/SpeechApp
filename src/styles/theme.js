import { keyframes } from '@emotion/react';

// Color palette
export const colors = {
  primary: {
    main: '#1e3c72',
    light: '#2a5298',
    dark: '#152c54',
    gradient: 'linear-gradient(135deg, #1e3c72, #2a5298)',
  },
  secondary: {
    main: '#87CEEB',
    light: '#B7E4F4',
    dark: '#5BA3C6',
  },
  accent: {
    blue: '#00BFFF',
    purple: '#9C27B0',
    green: '#4CAF50',
    red: '#FF6B6B',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.8)',
    dark: '#333333',
  },
  background: {
    glass: 'rgba(255, 255, 255, 0.25)',
    overlay: 'rgba(0, 0, 0, 0.3)',
    card: 'rgba(255, 255, 255, 0.9)',
  }
};

// Animation variants for Framer Motion
export const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  },
  content: {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  },
  heading: {
    hidden: { 
      opacity: 0,
      y: -50,
      scale: 0.8
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 0.8
      }
    }
  },
  card: {
    hidden: { 
      opacity: 0,
      x: -50,
      scale: 0.8
    },
    visible: { 
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    hover: { 
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    },
    tap: { 
      scale: 0.98,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  }
};

// Shared particle configuration
export const particlesConfig = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: [colors.text.primary, colors.secondary.main, colors.accent.blue, colors.secondary.light]
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.5,
      random: true,
      animation: {
        enable: true,
        speed: 1,
        minimumValue: 0.1,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      animation: {
        enable: true,
        speed: 2,
        minimumValue: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: colors.text.primary,
      opacity: 0.4,
      width: 1,
      triangles: {
        enable: true,
        color: colors.text.primary,
        opacity: 0.1
      }
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      straight: false,
      outModes: "out",
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detectsOn: "canvas",
    events: {
      onHover: {
        enable: true,
        mode: ["grab", "bubble"]
      },
      onClick: {
        enable: true,
        mode: "push"
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 140,
        links: {
          opacity: 1
        }
      },
      bubble: {
        distance: 200,
        size: 12,
        duration: 2,
        opacity: 0.8,
        speed: 3
      },
      push: {
        quantity: 4
      }
    }
  },
  retina_detect: true,
  background: {
    color: "transparent",
    position: "50% 50%",
    repeat: "no-repeat",
    size: "cover"
  }
};

// Shared component styles
export const componentStyles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    background: colors.primary.gradient,
    color: colors.text.primary,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "clamp(1rem, 5vw, 3rem)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
  },
  content: {
    width: "100%",
    maxWidth: "1200px",
    zIndex: 1,
    padding: "clamp(1rem, 3vw, 2rem)",
    backdropFilter: "blur(10px)",
    background: colors.background.glass,
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },
  heading: {
    fontSize: "clamp(2rem, 6vw, 3.5rem)",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "clamp(2rem, 5vw, 3rem)",
    background: `linear-gradient(45deg, ${colors.text.primary}, ${colors.secondary.main}, ${colors.accent.blue}, ${colors.text.primary})`,
    backgroundSize: "200% 200%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  },
  button: {
    fontSize: "1.4rem",
    padding: "16px 40px",
    borderRadius: "50px",
    background: colors.primary.light,
    color: colors.text.primary,
    fontWeight: "700",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 4px 15px rgba(42, 82, 152, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(42, 82, 152, 0.4)",
    },
    "&:active": {
      transform: "translateY(1px)",
    },
  },
  card: {
    padding: "clamp(1.5rem, 4vw, 2rem)",
    borderRadius: "15px",
    background: colors.background.card,
    color: colors.text.dark,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    backdropFilter: "blur(5px)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  timer: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: colors.text.primary,
    backgroundColor: colors.background.overlay,
    padding: "8px 16px",
    borderRadius: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  }
}; 