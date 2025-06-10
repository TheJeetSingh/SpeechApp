import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode"; // Import JWT decoder
import config from "../config"; // Import config for API URLs

// Use config.API_URL which handles development/production environments properly
const API_URL = config.API_URL; 

const ErrorPopup = ({ message, onClose }) => (
  <motion.div
    style={styles.errorPopup}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <span>{message}</span>
    <button style={styles.closeButton} onClick={onClose}>×</button>
  </motion.div>
);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();

  const parseErrorMessage = (error, responseStatus) => {
    // Check for specific error messages
    const errorMsg = error.toLowerCase();
    
    if (errorMsg.includes("invalid email or password") || 
        responseStatus === 401) {
      // Increment login attempts to track multiple failures
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        return {
          title: "Login Failed",
          message: "Multiple login attempts failed. Did you forget your password or need to create an account?"
        };
      }
      
      return {
        title: "Authentication Failed",
        message: "The email or password you entered is incorrect. Please try again."
      };
    }
    
    if (responseStatus === 429) {
      return {
        title: "Too Many Attempts",
        message: "Too many login attempts. Please try again later."
      };
    }
    
    if (errorMsg.includes("email") && errorMsg.includes("not found")) {
      return {
        title: "Account Not Found",
        message: "No account exists with this email. Would you like to sign up?"
      };
    }
    
    // Network or server errors
    if (responseStatus >= 500 || errorMsg.includes("network") || errorMsg.includes("connection")) {
      return {
        title: "Connection Error",
        message: "There was a problem connecting to our servers. Please check your internet connection and try again."
      };
    }
    
    // Default error message
    return {
      title: "Login Failed",
      message: error
    };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      // Log diagnostics
      console.log(`Attempting login to: ${API_URL}/api/login`);

      // Now attempt the actual login with explicit CORS mode
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
        mode: 'cors', // Explicitly set CORS mode
      });

      const data = await response.json();

      if (!response.ok) {
        // Parse the error message to provide a more user-friendly error
        const errorInfo = parseErrorMessage(data.message || "Unknown error", response.status);
        throw new Error(errorInfo.message);
      }

      // Reset login attempts on successful login
      setLoginAttempts(0);
      
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      
      // Decode and log token data to verify all fields are present
      try {
        const decoded = jwtDecode(data.token);
        console.log('Successfully logged in with user data:', {
          id: decoded.id || 'missing',
          name: decoded.name || 'missing',
          email: decoded.email || 'missing',
          school: decoded.school || 'missing'
        });
        
        // If user data is missing from token but present in response, use that
        if (!decoded.email && data.user && data.user.email) {
          console.log('Email missing from token but found in response. Using response data.');
          // Create a more complete token with all user data
          const completeUserData = {
            id: decoded.id || data.user.id,
            name: decoded.name || data.user.name,
            email: data.user.email,
            school: decoded.school || data.user.school || ''
          };
          
          // Store the complete user data separately for immediate access
          localStorage.setItem('userData', JSON.stringify(completeUserData));
        }
      } catch (decodeError) {
        console.error('Error decoding JWT token:', decodeError);
      }
      
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Failed to login. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.formContainer}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence>
          {error && <ErrorPopup message={error} onClose={() => setError("")} />}
        </AnimatePresence>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <motion.button
            type="submit"
            style={styles.submitButton}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(79, 172, 254, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            Log In
          </motion.button>
        </form>
        <p style={styles.linkText}>
          Don't have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
         <p style={{...styles.linkText, marginTop: '1rem'}}>
          <span style={styles.link} onClick={() => navigate("/home")}>
            Back to Home
          </span>
        </p>
      </motion.div>
    </div>
  );
}

const InputField = ({ label, ...props }) => (
  <div style={styles.formGroup}>
    <label style={styles.label}>{label}</label>
    <input style={styles.input} {...props} required />
  </div>
);

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #040913, #010209)",
    fontFamily: "'Exo', 'Inter', sans-serif",
    padding: "2rem",
    position: 'relative',
  },
  formContainer: {
    position: 'relative',
    background: "rgba(10, 25, 47, 0.85)",
    backdropFilter: 'blur(12px)',
    padding: "2.5rem 3rem",
    borderRadius: "20px",
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
    color: '#fff',
  },
  title: { 
    fontSize: "2.5rem", 
    fontWeight: "700", 
    marginBottom: "2rem",
    background: 'linear-gradient(to right, #4facfe, #00f2fe)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    textShadow: '0 0 20px rgba(79, 172, 254, 0.2)',
  },
  form: { display: "flex", flexDirection: "column", gap: "1.25rem" },
  formGroup: { display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "left" },
  label: { fontSize: "0.9rem", fontWeight: "500", color: "rgba(255, 255, 255, 0.7)" },
  input: {
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
    background: "rgba(0, 0, 0, 0.2)",
    color: "#fff",
    outline: "none",
    transition: "all 0.2s ease",
  },
  submitButton: {
    padding: "0.85rem",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(to right, #4facfe, #00f2fe)",
    color: "#010209",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "1rem",
  },
  errorText: { color: "red", fontSize: "0.9rem" },
  linkText: { fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.6)", marginTop: "1.5rem" },
  link: {
    color: "#4facfe",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    transition: 'color 0.2s ease',
  },
  goBackButton: {
    padding: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "#f39c12",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "15px",
  },
  errorPopup: {
    position: 'absolute',
    top: '-70px',
    left: '0',
    right: '0',
    marginLeft: 'auto',
    marginRight: 'auto',
    background: 'rgba(255, 77, 79, 0.9)',
    backdropFilter: 'blur(8px)',
    color: '#fff',
    padding: '0.85rem 1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1000,
    width: '90%',
    maxWidth: '400px',
    fontWeight: '500',
    transform: 'none',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.2rem',
    marginLeft: '15px',
    cursor: 'pointer',
    opacity: '0.8',
    transition: 'opacity 0.2s ease',
  }
};

export default Login;