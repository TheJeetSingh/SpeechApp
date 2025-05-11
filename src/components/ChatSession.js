import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VisualBackground from "./VisualBackground";
import { generateChatResponse } from "../utils/geminiApi";
import ReactMarkdown from "react-markdown";
import RateLimitPopup from './RateLimitPopup';

function ChatSession() {
  const [messages, setMessages] = useState([
    { id: 1, text: "👋 Hello! I'm ARTICULATE, your AI speech coach. How can I help you improve your speaking skills today?", sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [showRateLimitPopup, setShowRateLimitPopup] = useState(false);
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    
    // Add user message
    const newUserMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);
    
    // Get AI response
    try {
      const aiResponseText = await generateChatResponse([...messages, newUserMessage]);
      
      const aiResponse = { 
        id: Date.now() + 1, 
        text: aiResponseText, 
        sender: "ai" 
      };
      
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    } catch (err) {
      console.error("Error getting response from Gemini API:", err);
      setError(`Failed to get response: ${err.message || "Unknown error"}`);
      
      const errorResponse = { 
        id: Date.now() + 1, 
        text: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.", 
        sender: "ai" 
      };
      
      setMessages(prevMessages => [...prevMessages, errorResponse]);
      if (err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('rate limit')) {
        setShowRateLimitPopup(true);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Background */}
      <VisualBackground 
        colorMapping={{
          lowFreq: '#1a237e',
          midFreq: '#283593',
          highFreq: '#3949ab'
        }}
      />
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <motion.span 
              style={styles.micIcon}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >🎙️</motion.span>
          </div>
          <h1 style={styles.logo} onClick={() => navigate("/")}>ARTICULATE</h1>
        </div>
        <button style={styles.backButton} onClick={() => navigate("/ai-coach")}>
          Back to Coach Hub
        </button>
      </header>
      
      {/* Chat Container */}
      <div style={styles.chatContainer}>
        <div style={styles.chatHeader}>
          <h2 style={styles.chatTitle}>AI Speech Coach</h2>
          <div style={styles.tabContainer}>
            <div style={styles.activeTab}>Live Coaching</div>
            <div style={styles.inactiveTab}>Speech History</div>
            <div style={styles.inactiveTab}>Resources</div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div style={styles.errorContainer}>
            <p style={styles.errorMessage}>{error}</p>
          </div>
        )}
        
        {/* Messages Area */}
        <div style={styles.messagesContainer}>
          <div style={styles.dateIndicator}>Today</div>
          
          {messages.map(message => (
            <motion.div 
              key={message.id}
              style={{
                ...styles.messageWrapper,
                justifyContent: message.sender === "user" ? "flex-end" : "flex-start"
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.sender === "ai" && (
                <div style={styles.avatarContainer}>
                  <div style={styles.avatar}>A</div>
                </div>
              )}
              
              <div style={{
                ...styles.message,
                ...(message.sender === "user" ? styles.userMessage : styles.aiMessage)
              }}>
                <div style={styles.messageContent}>
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
                <div style={styles.messageTime}>
                  {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
              
              {message.sender === "user" && (
                <div style={styles.avatarContainer}>
                  <div style={styles.userAvatar}>You</div>
                </div>
              )}
            </motion.div>
          ))}
          
          {isTyping && (
            <div style={{...styles.messageWrapper, justifyContent: "flex-start"}}>
              <div style={styles.avatarContainer}>
                <div style={styles.avatar}>A</div>
              </div>
              <div style={{...styles.message, ...styles.aiMessage, width: "auto"}}>
                <motion.div 
                  style={styles.typingIndicator}
                  animate={{ 
                    y: [0, -5, 0],
                    transition: { 
                      repeat: Infinity, 
                      duration: 0.7,
                      repeatType: "loop",
                      ease: "easeInOut",
                      times: [0, 0.5, 1],
                      repeatDelay: 0
                    }
                  }}
                >
                  <span style={styles.typingDot}></span>
                  <span style={{...styles.typingDot, animationDelay: "0.2s"}}></span>
                  <span style={{...styles.typingDot, animationDelay: "0.4s"}}></span>
                </motion.div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div style={styles.inputContainer}>
          <div style={styles.inputButtons}>
            <div style={styles.inputSuggestions}>
              <div style={styles.suggestionPill}>How to reduce filler words?</div>
              <div style={styles.suggestionPill}>Tips for speaking confidently</div>
              <div style={styles.suggestionPill}>Help with presentation anxiety</div>
            </div>
          </div>
          
          <form style={styles.inputForm} onSubmit={handleSendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your speech coach a question..."
              style={styles.textInput}
            />
            <button 
              type="submit" 
              style={styles.sendButton} 
              disabled={input.trim() === ""}
            >
              Send
            </button>
          </form>
        </div>
      </div>
      
      <RateLimitPopup 
        isOpen={showRateLimitPopup} 
        onClose={() => setShowRateLimitPopup(false)} 
      />
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f5f7fa",
  },
  header: {
    width: "100%",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(135deg, #3949ab 0%, #1a237e 100%)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
  },
  logoIcon: {
    fontSize: "1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  micIcon: {
    display: "inline-block",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "800",
    margin: 0,
    color: "#ffffff",
    letterSpacing: "1px",
    cursor: "pointer",
  },
  backButton: {
    padding: "0.6rem 1.2rem",
    background: "rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "24px",
    color: "#fff",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.25)",
    },
  },
  chatContainer: {
    width: "100%",
    maxWidth: "1100px",
    height: "calc(100vh - 80px)",
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
    borderRadius: "16px",
    margin: "1rem",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    border: "1px solid rgba(0, 0, 0, 0.05)",
  },
  chatHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
    backgroundColor: "#fafbfc",
  },
  chatTitle: {
    margin: 0,
    color: "#303f9f",
    fontSize: "1.6rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "1rem",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  activeTab: {
    padding: "0.6rem 1.2rem",
    borderRadius: "20px",
    backgroundColor: "#3949ab",
    color: "white",
    fontWeight: "600",
    fontSize: "0.9rem",
    boxShadow: "0 2px 8px rgba(57, 73, 171, 0.3)",
  },
  inactiveTab: {
    padding: "0.6rem 1.2rem",
    borderRadius: "20px",
    backgroundColor: "#f0f2f5",
    color: "#5f6368",
    fontWeight: "500",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#e4e6eb",
    },
  },
  errorContainer: {
    padding: "0.8rem 1.2rem",
    margin: "0.8rem",
    backgroundColor: "rgba(253, 237, 237, 1)",
    borderRadius: "8px",
    borderLeft: "4px solid #ef5350",
  },
  errorMessage: {
    color: "#d32f2f",
    margin: 0,
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  messagesContainer: {
    flex: 1,
    padding: "1.5rem",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    backgroundColor: "#f9fafc",
  },
  dateIndicator: {
    alignSelf: "center",
    padding: "0.4rem 0.8rem",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: "12px",
    fontSize: "0.8rem",
    color: "#5f6368",
    marginBottom: "1rem",
    fontWeight: "500",
  },
  messageWrapper: {
    display: "flex",
    width: "100%",
    alignItems: "flex-start",
    gap: "0.8rem",
  },
  avatarContainer: {
    width: "36px",
    height: "36px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "36px",
    height: "36px",
    backgroundColor: "#3949ab",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "600",
    fontSize: "1rem",
    boxShadow: "0 2px 8px rgba(57, 73, 171, 0.3)",
  },
  userAvatar: {
    width: "36px",
    height: "36px",
    backgroundColor: "#303f9f",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "500",
    fontSize: "0.7rem",
    boxShadow: "0 2px 8px rgba(48, 63, 159, 0.3)",
  },
  message: {
    maxWidth: "70%",
    padding: "1rem 1.2rem",
    borderRadius: "18px",
    fontSize: "1rem",
    lineHeight: 1.6,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
    position: "relative",
  },
  messageContent: {
    marginBottom: "1rem",
  },
  messageTime: {
    position: "absolute",
    bottom: "0.5rem",
    right: "1rem",
    fontSize: "0.7rem",
    color: "rgba(0, 0, 0, 0.4)",
  },
  userMessage: {
    backgroundColor: "#e1f5fe",
    color: "#01579b",
    borderBottomRightRadius: "4px",
    borderTopLeftRadius: "18px",
    boxShadow: "0 2px 8px rgba(3, 169, 244, 0.1)",
  },
  aiMessage: {
    backgroundColor: "#e8eaf6",
    color: "#283593",
    borderBottomLeftRadius: "4px",
    borderTopRightRadius: "18px",
    boxShadow: "0 2px 8px rgba(40, 53, 147, 0.08)",
  },
  typingIndicator: {
    display: "flex",
    gap: "6px",
    padding: "0.5rem 1rem",
  },
  typingDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#3949ab",
    opacity: 0.6,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
    padding: "1.2rem",
    borderTop: "1px solid rgba(0, 0, 0, 0.05)",
    background: "white",
  },
  inputButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },
  inputSuggestions: {
    display: "flex",
    gap: "0.5rem",
    overflowX: "auto",
    padding: "0.3rem 0",
    marginTop: "0.3rem",
  },
  suggestionPill: {
    padding: "0.5rem 1rem",
    backgroundColor: "#e8eaf6",
    color: "#3949ab",
    borderRadius: "16px",
    fontSize: "0.8rem",
    whiteSpace: "nowrap",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontWeight: "500",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      backgroundColor: "#c5cae9",
    },
  },
  inputForm: {
    display: "flex",
    gap: "0.8rem",
  },
  textInput: {
    flex: 1,
    padding: "1rem 1.2rem",
    fontSize: "1rem",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    borderRadius: "24px",
    outline: "none",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    fontFamily: "'Poppins', sans-serif",
    "&:focus": {
      borderColor: "#3949ab",
      boxShadow: "0 2px 12px rgba(57, 73, 171, 0.15)",
    },
    "&:disabled": {
      backgroundColor: "#f5f5f5",
      color: "#9e9e9e",
      cursor: "not-allowed",
    },
  },
  sendButton: {
    padding: "1rem 1.5rem",
    backgroundColor: "#4e42d4",
    color: "white",
    border: "none",
    borderRadius: "24px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(78, 66, 212, 0.2)",
    "&:hover": {
      backgroundColor: "#3832a8",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(78, 66, 212, 0.25)",
    },
    "&:disabled": {
      backgroundColor: "#c5cae9",
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },
  },
};

export default ChatSession; 