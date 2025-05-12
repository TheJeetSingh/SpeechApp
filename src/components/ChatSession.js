import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { generateChatResponse } from "../utils/geminiApi";
import ReactMarkdown from "react-markdown";
import RateLimitPopup from './RateLimitPopup';

// Theme colors - refined palette
const themeColors = {
  primary: {
    main: '#2c5282',
    dark: '#1a365d',
    light: '#4299e1',
  },
  accent: {
    blue: '#3182ce',
    purple: '#6b46c1',
    green: '#38a169',
    red: '#e53e3e',
  },
  text: {
    primary: '#2d3748',
    secondary: '#4a5568',
    bright: '#ffffff',
  },
  background: {
    main: '#f7fafc',
    card: '#ffffff',
    dark: '#1a202c',
    light: '#f5f7fa',
  },
  ui: {
    border: 'rgba(0, 0, 0, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.15)',
  }
};

// Confirmation Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ 
            color: themeColors.primary.main, 
            marginTop: 0,
            fontSize: '1.3rem',
            fontWeight: '600',
          }}>
            Start New Conversation
          </h3>
          <p style={{ 
            marginBottom: '24px', 
            lineHeight: '1.6',
            color: themeColors.text.secondary
          }}>
            Are you sure you want to start a new conversation? Your current chat history will be cleared.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: '#e2e8f0',
                color: themeColors.text.secondary,
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
              onClick={onClose}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: themeColors.primary.main,
                color: 'white',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
              onClick={onConfirm}
            >
              Start New Conversation
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Maximum number of tokens to keep in conversation history (approx)
const MAX_TOKENS = 6000;

// Utility to estimate token count (rough estimate)
const estimateTokens = (text) => Math.ceil(text.length / 4);

// Utility to trim conversation if it gets too long
const trimConversationIfNeeded = (messages) => {
  // Always keep at least 4 messages if possible
  if (messages.length <= 4) return messages;
  
  let totalTokens = 0;
  let startIndex = 0;
  
  // Calculate tokens from newest to oldest
  for (let i = messages.length - 1; i >= 0; i--) {
    const tokens = estimateTokens(messages[i].text);
    if (totalTokens + tokens > MAX_TOKENS && i > 0) {
      startIndex = i;
      break;
    }
    totalTokens += tokens;
  }
  
  return messages.slice(startIndex);
};

function ChatSession() {
  const location = useLocation();
  const { analysisData } = location.state || {};
  
  // Format time in minutes and seconds
  const formatTime = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Initialize messages with a welcome message or speech analysis data if available
  const initialMessages = () => {
    // Try to load saved messages from localStorage first
    const savedMessages = localStorage.getItem('chatHistory');
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // If we have analysisData and saved messages don't start with analysis data,
        // we'll create a new conversation with the analysis
        if (analysisData && parsedMessages.length > 0 && !parsedMessages[0].text.includes("AI speech coach")) {
          return createNewConversation();
        }
        return parsedMessages;
      } catch (e) {
        console.error("Error parsing saved messages:", e);
        return createNewConversation();
      }
    } else {
      return createNewConversation();
    }
  };
  
  // Create a new conversation with welcome message or analysis data
  const createNewConversation = () => {
    if (analysisData) {
      // Format the speech analysis data into a welcome message
      const speechInfo = `
## Speech Analysis Summary

**Type:** ${analysisData.speechType || "N/A"}
**Topic:** ${analysisData.topic || "N/A"}
**Duration:** ${formatTime(analysisData.duration) || "N/A"}
**Grade:** ${analysisData.grade || "N/A"} (${analysisData.score || 0}/100)

### Transcript:
${analysisData.transcript || "No transcript available."}

### Feedback:
${analysisData.feedback || "No feedback available."}

### Strengths:
${analysisData.strengths?.map(strength => `- ${strength}`).join('\n') || "- None identified"}

### Areas for Improvement:
${analysisData.improvements?.map(improvement => `- ${improvement}`).join('\n') || "- None identified"}

How would you like me to help you improve your speech?
      `;
      
      return [
        { 
          id: 1, 
          text: "👋 Hello! I'm ARTICULATE, your AI speech coach. I see you've shared your speech analysis with me.", 
          sender: "ai" 
        },
        { 
          id: 2, 
          text: speechInfo, 
          sender: "ai" 
        }
      ];
    } else {
      // Default welcome message
      return [
        { 
          id: 1, 
          text: "👋 Hello! I'm ARTICULATE, your AI speech coach. How can I help you improve your speaking skills today?", 
          sender: "ai" 
        }
      ];
    }
  };

  const [messages, setMessages] = useState(initialMessages());
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [showRateLimitPopup, setShowRateLimitPopup] = useState(false);
  const [showNewChatConfirm, setShowNewChatConfirm] = useState(false);
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Save messages to localStorage whenever they change
  useEffect(() => {
    const trimmedMessages = trimConversationIfNeeded(messages);
    localStorage.setItem('chatHistory', JSON.stringify(trimmedMessages));
    if (trimmedMessages.length !== messages.length) {
      setMessages(trimmedMessages);
    }
  }, [messages]);

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
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);
    setError(null);
    
    // Get AI response - send entire conversation history
    try {
      const aiResponseText = await generateChatResponse(updatedMessages);
      
      const aiResponse = { 
        id: Date.now() + 1, 
        text: aiResponseText, 
        sender: "ai" 
      };
      
      setMessages([...updatedMessages, aiResponse]);
    } catch (err) {
      console.error("Error getting response from Gemini API:", err);
      setError(`Failed to get response: ${err.message || "Unknown error"}`);
      
      const errorResponse = { 
        id: Date.now() + 1, 
        text: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.", 
        sender: "ai" 
      };
      
      setMessages([...updatedMessages, errorResponse]);
      if (err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('rate limit')) {
        setShowRateLimitPopup(true);
      }
    } finally {
      setIsTyping(false);
    }
  };

  // Function to handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    // Optional: Auto-submit the form
    const form = document.getElementById("chat-form");
    if (form) form.dispatchEvent(new Event("submit", { cancelable: true }));
  };

  // Custom suggestions based on speech analysis
  const getSuggestions = () => {
    if (analysisData) {
      const customSuggestions = [
        "How can I improve my " + (analysisData.speechType || "speech") + " delivery?",
        "What techniques can help with my areas for improvement?",
        "Can you give me exercises to practice?"
      ];
      return customSuggestions;
    }
    
    // Default suggestions
    return [
      "How to reduce filler words?",
      "Tips for speaking confidently",
      "Help with presentation anxiety"
    ];
  };

  // Function to start a new chat
  const handleNewChat = () => {
    setShowNewChatConfirm(true);
  };
  
  // Function to confirm new chat
  const confirmNewChat = () => {
    const newConversation = createNewConversation();
    setMessages(newConversation);
    localStorage.setItem('chatHistory', JSON.stringify(newConversation));
    setShowNewChatConfirm(false);
  };
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <span style={styles.micIcon}>🎙️</span>
          </div>
          <h1 style={styles.logo} onClick={() => navigate("/")}>ARTICULATE</h1>
        </div>
        <div style={styles.headerButtons}>
          <motion.button 
            style={styles.newChatButton}
            whileHover={{ scale: 1.05, boxShadow: `0 4px 12px ${themeColors.accent.blue}60` }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNewChat}
          >
            New Chat
          </motion.button>
          <motion.button 
            style={styles.backButton}
            whileHover={{ scale: 1.05, background: "rgba(255, 255, 255, 0.25)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/ai-coach")}
          >
            Back to Coach Hub
          </motion.button>
        </div>
      </header>
      
      {/* Chat Container */}
      <div style={styles.chatContainer}>
        <div style={styles.chatHeader}>
          <h2 style={styles.chatTitle}>AI Speech Coach</h2>
          <div style={styles.tabContainer}>
            <div style={styles.activeTab}>Live Coaching</div>
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
                  {message.sender === "ai" ? (
                    <ReactMarkdown 
                      components={{
                        h1: ({node, ...props}) => <h1 style={styles.mdHeading1} {...props} />,
                        h2: ({node, ...props}) => <h2 style={styles.mdHeading2} {...props} />,
                        h3: ({node, ...props}) => <h3 style={styles.mdHeading3} {...props} />,
                        p: ({node, ...props}) => <p style={styles.mdParagraph} {...props} />,
                        ul: ({node, ...props}) => <ul style={styles.mdList} {...props} />,
                        ol: ({node, ...props}) => <ol style={styles.mdList} {...props} />,
                        li: ({node, ...props}) => <li style={styles.mdListItem} {...props} />,
                        a: ({node, ...props}) => <a style={styles.mdLink} {...props} />,
                        code: ({node, inline, ...props}) => 
                          inline ? 
                            <code style={styles.mdInlineCode} {...props} /> : 
                            <code style={styles.mdCodeBlock} {...props} />,
                        blockquote: ({node, ...props}) => <blockquote style={styles.mdBlockquote} {...props} />,
                        strong: ({node, ...props}) => <strong style={styles.mdBold} {...props} />,
                        em: ({node, ...props}) => <em style={styles.mdItalic} {...props} />
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  ) : (
                    <p style={styles.userText}>{message.text}</p>
                  )}
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
              {getSuggestions().map((suggestion, index) => (
                <motion.div 
                  key={index}
                  style={styles.suggestionPill}
                  whileHover={{ scale: 1.05, backgroundColor: '#c5cae9' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </motion.div>
              ))}
            </div>
          </div>
          
          <form id="chat-form" style={styles.inputForm} onSubmit={handleSendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={styles.textInput}
            />
            <motion.button 
              type="submit" 
              style={styles.sendButton}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: themeColors.primary.dark,
                boxShadow: `0 6px 16px ${themeColors.primary.main}60`
              }}
              whileTap={{ scale: 0.95 }}
              disabled={isTyping}
            >
              Send
            </motion.button>
          </form>
        </div>
      </div>
      
      {/* Modals */}
      <RateLimitPopup 
        isOpen={showRateLimitPopup} 
        onClose={() => setShowRateLimitPopup(false)} 
      />
      
      <ConfirmModal
        isOpen={showNewChatConfirm}
        onClose={() => setShowNewChatConfirm(false)}
        onConfirm={confirmNewChat}
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
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
    backgroundColor: themeColors.background.main,
    position: "relative",
  },
  header: {
    width: "100%",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: themeColors.primary.main,
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
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
    fontWeight: "700",
    margin: 0,
    color: themeColors.text.bright,
    letterSpacing: "0.5px",
    cursor: "pointer",
  },
  headerButtons: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  backButton: {
    padding: "0.6rem 1.2rem",
    background: "rgba(255, 255, 255, 0.15)",
    border: "none",
    borderRadius: "6px",
    color: themeColors.text.bright,
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  newChatButton: {
    padding: "0.6rem 1.2rem",
    backgroundColor: themeColors.accent.blue,
    color: themeColors.text.bright,
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
  },
  chatContainer: {
    width: "100%",
    maxWidth: "1000px",
    height: "calc(100vh - 80px)",
    display: "flex",
    flexDirection: "column",
    background: themeColors.background.card,
    borderRadius: "12px",
    margin: "1rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    border: "1px solid rgba(0, 0, 0, 0.05)",
  },
  chatHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
    backgroundColor: themeColors.background.light,
  },
  chatTitle: {
    margin: 0,
    color: themeColors.primary.main,
    fontSize: "1.5rem",
    fontWeight: "600",
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
    borderRadius: "6px",
    backgroundColor: themeColors.primary.main,
    color: themeColors.text.bright,
    fontWeight: "500",
    fontSize: "0.9rem",
    boxShadow: `0 2px 6px ${themeColors.primary.main}50`,
  },
  inactiveTab: {
    padding: "0.6rem 1.2rem",
    borderRadius: "6px",
    backgroundColor: "#edf2f7",
    color: themeColors.text.secondary,
    fontWeight: "500",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  errorContainer: {
    padding: "0.8rem 1.2rem",
    margin: "0.8rem",
    backgroundColor: "#fff5f5",
    borderRadius: "6px",
    borderLeft: "4px solid " + themeColors.accent.red,
  },
  errorMessage: {
    color: themeColors.accent.red,
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
    backgroundColor: themeColors.background.light,
  },
  dateIndicator: {
    alignSelf: "center",
    padding: "0.4rem 0.8rem",
    backgroundColor: "#edf2f7",
    borderRadius: "6px",
    fontSize: "0.8rem",
    color: themeColors.text.secondary,
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
    width: "34px",
    height: "34px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "34px",
    height: "34px",
    backgroundColor: themeColors.primary.main,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: themeColors.text.bright,
    fontWeight: "600",
    fontSize: "0.9rem",
    boxShadow: `0 2px 6px ${themeColors.primary.main}40`,
  },
  userAvatar: {
    width: "34px",
    height: "34px",
    backgroundColor: themeColors.accent.blue,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: themeColors.text.bright,
    fontWeight: "500",
    fontSize: "0.7rem",
    boxShadow: `0 2px 6px ${themeColors.accent.blue}40`,
  },
  message: {
    maxWidth: "70%",
    padding: "1rem 1.2rem",
    borderRadius: "12px",
    fontSize: "0.95rem",
    lineHeight: 1.6,
    letterSpacing: "0.01em",
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
    backgroundColor: "#ebf8ff",
    color: themeColors.primary.dark,
    borderBottomRightRadius: "4px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
  },
  aiMessage: {
    backgroundColor: "#f0f5fa",
    color: themeColors.primary.dark,
    borderBottomLeftRadius: "4px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
  },
  typingIndicator: {
    display: "flex",
    gap: "6px",
    padding: "0.5rem 1rem",
  },
  typingDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: themeColors.primary.main,
    opacity: 0.6,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
    padding: "1.2rem",
    borderTop: "1px solid rgba(0, 0, 0, 0.05)",
    background: themeColors.background.card,
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
    flexWrap: "wrap",
  },
  suggestionPill: {
    padding: "0.5rem 1rem",
    backgroundColor: "#edf2f7",
    color: themeColors.primary.main,
    borderRadius: "6px",
    fontSize: "0.8rem",
    whiteSpace: "nowrap",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontWeight: "500",
    marginBottom: "6px",
  },
  inputForm: {
    display: "flex",
    gap: "0.8rem",
  },
  textInput: {
    flex: 1,
    padding: "0.9rem 1.2rem",
    fontSize: "0.95rem",
    borderRadius: "8px",
    border: `1px solid ${themeColors.ui.border}`,
    outline: "none",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
  },
  sendButton: {
    padding: "0.8rem 1.5rem",
    backgroundColor: themeColors.primary.main,
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  },
  mdHeading1: {
    fontSize: "1.4rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: themeColors.primary.dark,
  },
  mdHeading2: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    color: themeColors.primary.dark,
  },
  mdHeading3: {
    fontSize: "1rem",
    fontWeight: "500",
    marginBottom: "0.25rem",
    color: themeColors.primary.dark,
  },
  mdParagraph: {
    marginBottom: "1rem",
  },
  mdList: {
    marginLeft: "1.5rem",
    marginBottom: "1rem",
  },
  mdListItem: {
    marginBottom: "0.5rem",
  },
  mdLink: {
    color: themeColors.accent.blue,
    textDecoration: "underline",
  },
  mdInlineCode: {
    backgroundColor: "#edf2f7",
    padding: "0.2rem 0.4rem",
    borderRadius: "4px",
    fontSize: "0.85rem",
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
  },
  mdCodeBlock: {
    backgroundColor: "#edf2f7",
    padding: "1rem",
    borderRadius: "6px",
    marginBottom: "1rem",
    fontSize: "0.85rem",
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    overflowX: "auto",
  },
  mdBlockquote: {
    backgroundColor: "#edf2f7",
    padding: "1rem",
    borderRadius: "6px",
    marginBottom: "1rem",
    borderLeft: `4px solid ${themeColors.primary.light}`,
  },
  mdBold: {
    fontWeight: "600",
  },
  mdItalic: {
    fontStyle: "italic",
  },
  userText: {
    margin: 0,
    fontSize: "0.95rem",
    lineHeight: 1.6,
  },
  // Media query handling for mobile
  '@media (max-width: 768px)': {
    chatContainer: {
      width: "100%",
      margin: "0",
      borderRadius: "0",
      maxWidth: "none",
    },
    message: {
      maxWidth: "85%",
    },
    header: {
      padding: "0.8rem 1rem",
    },
    sendButton: {
      padding: "0.8rem 1rem",
    },
    headerButtons: {
      gap: "0.5rem",
    },
    newChatButton: {
      padding: "0.5rem 0.8rem",
      fontSize: "0.8rem",
    },
    backButton: {
      padding: "0.5rem 0.8rem",
      fontSize: "0.8rem",
    },
  }
};

export default ChatSession; 