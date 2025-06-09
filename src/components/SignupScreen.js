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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
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

      if (!response.ok) {
        // Try to get the error message from the response
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
        } catch (jsonError) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
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
    top: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(255, 77, 79, 0.85)',
    backdropFilter: 'blur(5px)',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.2rem',
    marginLeft: '15px',
    cursor: 'pointer',
  }
};

export default Signup;