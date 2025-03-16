import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { isMobile } from "react-device-detect";
import { colors, animations, componentStyles } from "../styles/theme";

function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("https://speech-app-server.vercel.app/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred. Please try again later.");
    }
  };

  const getMobileStyles = (baseStyles, mobileStyles) => {
    return isMobile ? { ...baseStyles, ...mobileStyles } : baseStyles;
  };

  const styles = {
    container: getMobileStyles({
      ...componentStyles.container,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "2rem",
      position: "relative",
    }, {
      padding: "1rem",
    }),

    formContainer: getMobileStyles({
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.18)",
      borderRadius: "clamp(1rem, 3vw, 1.5rem)",
      padding: "clamp(2rem, 5vw, 3rem)",
      width: "100%",
      maxWidth: "500px",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    }, {
      padding: "1.5rem",
      borderRadius: "1rem",
    }),

    title: getMobileStyles({
      fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
      color: colors.text.primary,
      marginBottom: "clamp(1.5rem, 4vw, 2rem)",
      textAlign: "center",
      background: `linear-gradient(45deg, ${colors.text.primary}, ${colors.accent.purple})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }, {
      fontSize: "1.8rem",
      marginBottom: "1.5rem",
    }),

    form: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "clamp(1rem, 3vw, 1.5rem)",
    },

    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },

    label: getMobileStyles({
      fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
      color: colors.text.primary,
      fontWeight: "500",
    }, {
      fontSize: "0.9rem",
    }),

    input: getMobileStyles({
      padding: "clamp(0.75rem, 2vw, 1rem)",
      fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
      background: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "0.5rem",
      color: colors.text.primary,
      width: "100%",
      transition: "all 0.3s ease",
      "&:focus": {
        outline: "none",
        borderColor: colors.accent.purple,
        background: "rgba(255, 255, 255, 0.15)",
      },
    }, {
      padding: "0.75rem",
      fontSize: "0.9rem",
    }),

    submitButton: getMobileStyles({
      padding: "clamp(0.75rem, 2vw, 1rem)",
      fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
      background: colors.accent.purple,
      color: colors.text.primary,
      border: "none",
      borderRadius: "0.5rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "1rem",
      "&:hover": {
        background: colors.accent.purpleDark,
      },
    }, {
      padding: "0.75rem",
      fontSize: "1rem",
    }),

    errorText: {
      color: colors.error,
      fontSize: "0.9rem",
      textAlign: "center",
      marginTop: "1rem",
    },

    goBackButton: getMobileStyles({
      position: "absolute",
      top: "2rem",
      left: "2rem",
      background: "none",
      border: "none",
      color: colors.text.primary,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
      padding: "0.5rem",
      transition: "all 0.3s ease",
      "&:hover": {
        color: colors.accent.purple,
      },
    }, {
      top: "1rem",
      left: "1rem",
      fontSize: "0.9rem",
    }),
  };

  return (
    <motion.div
      style={styles.container}
      variants={animations.container}
      initial="hidden"
      animate="visible"
    >
      <button
        style={styles.goBackButton}
        onClick={() => navigate("/")}
      >
        <FiArrowLeft />
        Back
      </button>

      <div style={styles.formContainer}>
        <h1 style={styles.title}>Sign Up</h1>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">
              Email
            </label>
            <input
              style={styles.input}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              style={styles.input}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              style={styles.input}
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" style={styles.submitButton}>
            Sign Up
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default SignupScreen;