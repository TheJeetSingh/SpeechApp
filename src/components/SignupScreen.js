import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const parseErrorMessage = (error, responseStatus) => {
    // Check for specific error messages
    const errorMsg = error.toLowerCase();
    
    if (errorMsg.includes("email already exists") || 
        errorMsg.includes("user with this email already exists")) {
      return {
        title: "Email Already Registered",
        message: "This email is already registered. Please try logging in instead or use a different email."
      };
    }
    
    if (errorMsg.includes("password") && 
        (errorMsg.includes("weak") || errorMsg.includes("short"))) {
      return {
        title: "Password Too Weak", 
        message: "Please use a stronger password with at least 8 characters, including numbers and special characters."
      };
    }
    
    if (responseStatus === 429) {
      return {
        title: "Too Many Attempts",
        message: "Too many signup attempts. Please try again later."
      };
    }
    
    if (errorMsg.includes("name") && errorMsg.includes("required")) {
      return {
        title: "Name Required",
        message: "Please provide your name to create an account."
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
      title: "Signup Failed",
      message: error
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validate password strength before submitting
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      // Log diagnostics
      console.log(`Attempting signup to: ${API_URL}/api/signup`);

      // Attempt the signup with explicit CORS mode
      const response = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
        mode: 'cors', // Explicitly set CORS mode
      });

      const data = await response.json();

      if (!response.ok) {
        // Parse the error message to provide a more user-friendly error
        const errorInfo = parseErrorMessage(data.message || "Unknown error", response.status);
        throw new Error(errorInfo.message);
        }

      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message || "Failed to sign up. Please try again.");
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
        <h2 style={styles.title}>Sign Up</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <InputField
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <motion.button
            type="submit"
            style={styles.submitButton}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(79, 172, 254, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </form>
        <p style={styles.linkText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Log In
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
    padding: "clamp(1rem, 5vw, 2rem)",
    position: 'relative',
  },
  formContainer: {
    position: 'relative',
    background: "rgba(10, 25, 47, 0.85)",
    backdropFilter: 'blur(12px)',
    padding: "clamp(1.5rem, 8vw, 2.5rem) clamp(1.5rem, 8vw, 3rem)",
    borderRadius: "20px",
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
    color: '#fff',
  },
  title: {
    fontSize: "clamp(1.8rem, 8vw, 2.5rem)",
    fontWeight: "700",
    marginBottom: "clamp(1rem, 5vw, 2rem)",
    background: 'linear-gradient(to right, #4facfe, #00f2fe)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    textShadow: '0 0 20px rgba(79, 172, 254, 0.2)',
  },
  form: { display: "flex", flexDirection: "column", gap: "clamp(1rem, 4vw, 1.25rem)" },
  formGroup: { display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "left" },
  label: { fontSize: "clamp(0.85rem, 3vw, 0.9rem)", fontWeight: "500", color: "rgba(255, 255, 255, 0.7)" },
  input: {
    padding: "clamp(0.75rem, 3vw, 0.9rem) clamp(1rem, 4vw, 1.2rem)",
    fontSize: "clamp(1rem, 4vw, 1.1rem)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
    background: "rgba(0, 0, 0, 0.2)",
    color: "#fff",
    outline: "none",
    transition: "all 0.2s ease",
    minHeight: "44px", // Touch target size
    width: "100%",
    boxSizing: "border-box",
  },
  submitButton: {
    padding: "clamp(0.85rem, 3vw, 1rem)",
    fontSize: "clamp(1rem, 4vw, 1.1rem)",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(to right, #4facfe, #00f2fe)",
    color: "#010209",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "1rem",
    minHeight: "48px", // Touch target size
    width: "100%",
  },
  errorText: { color: "red", fontSize: "clamp(0.85rem, 3vw, 0.9rem)" },
  linkText: { fontSize: "clamp(0.85rem, 3vw, 0.9rem)", color: "rgba(255, 255, 255, 0.6)", marginTop: "1.5rem" },
  link: {
    color: "#4facfe",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    transition: 'color 0.2s ease',
    minHeight: "44px",
    display: "inline-flex",
    alignItems: "center",
  },
  goBackButton: {
    padding: "clamp(12px, 3vw, 16px)",
    fontSize: "clamp(0.95rem, 3vw, 1rem)",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "#f39c12",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "15px",
    minHeight: "44px",
    width: "100%",
    maxWidth: "200px",
  },
    errorPopup: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(255, 77, 79, 0.95)',
    backdropFilter: 'blur(8px)',
    color: '#fff',
    padding: 'clamp(0.75rem, 3vw, 0.85rem) clamp(1rem, 4vw, 1.5rem)',
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
    fontSize: 'clamp(0.85rem, 3vw, 0.9rem)',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 'clamp(1.1rem, 4vw, 1.2rem)',
    marginLeft: 'clamp(10px, 3vw, 15px)',
    cursor: 'pointer',
    opacity: '0.8',
    transition: 'opacity 0.2s ease',
    minWidth: '24px',
    minHeight: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default Signup;