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
        <h2 style={styles.title}>Login</h2>
        {error && <p style={styles.errorText}>{error}</p>}
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
            whileHover={{ scale: 1.05 }}
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#1e3c72",
    fontFamily: "Poppins, sans-serif",
  },
  formContainer: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: { fontSize: "2rem", fontWeight: "700", marginBottom: "20px", color: "#222" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "5px", textAlign: "left" },
  label: { fontSize: "0.9rem", fontWeight: "600", color: "#444" },
  input: {
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  submitButton: {
    padding: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "#00c853",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  errorText: { color: "red", fontSize: "0.9rem" },
  linkText: { fontSize: "0.9rem", color: "#444", marginTop: "15px" },
  link: {
    color: "#00c853",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
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