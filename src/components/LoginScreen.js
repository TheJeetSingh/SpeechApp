import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import config from "../config"; // Import config for API URLs

// Use config.API_URL which handles development/production environments properly
const API_URL = config.API_URL; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

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
      navigate("/");
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
        <h2 style={styles.heading}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
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
            style={styles.button}
            whileHover={styles.buttonHover}
            whileTap={{ scale: 0.95 }}
          >
            Log In
          </motion.button>
        </form>
        <p style={styles.switch}>
          Don't have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
        <motion.button
          style={styles.goBackButton}
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Go Back to Home
        </motion.button>
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
    height: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #4B79A1, #283E51)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "90%",
    maxWidth: "500px",
    padding: "2.5rem",
    borderRadius: "20px",
    backgroundColor: "rgba(42, 82, 152, 0.95)",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.5)",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "2rem",
    color: "#FFFFFF",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  formGroup: { display: "flex", flexDirection: "column", gap: "5px", textAlign: "left" },
  label: { fontSize: "0.9rem", fontWeight: "600", color: "#444" },
  input: {
    width: "100%",
    padding: "1rem",
    marginBottom: "1.5rem",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "#FFFFFF",
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    padding: "1rem",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2196F3",
    color: "#FFFFFF",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "1rem",
    transition: "all 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#0D47A1",
  },
  error: {
    backgroundColor: "rgba(255, 82, 82, 0.9)",
    color: "#FFFFFF",
    padding: "1rem",
    borderRadius: "10px",
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  switch: {
    marginTop: "2rem",
    textAlign: "center",
    color: "#FFFFFF",
  },
  link: {
    color: "#2196F3",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  linkHover: {
    color: "#0D47A1",
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
};

export default Login;