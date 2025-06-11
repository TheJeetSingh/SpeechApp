import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiArrowLeft, FiLogOut, FiEdit, FiSave, FiSettings } from 'react-icons/fi';
import { jwtDecode } from "jwt-decode";
import config from '../config';

const API_URL = config.API_URL;

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', school: '' });
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const [schoolInput, setSchoolInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Fetch the latest user data from the server
          const response = await fetch(`${API_URL}/api/user/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });

          if (!response.ok) {
            // This could be because the token is expired or invalid
            throw new Error('Failed to fetch user data');
          }

          const userDataFromServer = await response.json();
          console.log('Fetched fresh user data from server:', userDataFromServer);
          
          setUserData({
            name: userDataFromServer.name || '',
            email: userDataFromServer.email || '',
            school: userDataFromServer.school || ''
          });
          setSchoolInput(userDataFromServer.school || '');
          setIsLoggedIn(true);
          setActiveTab('profile');

        } catch (error) {
          console.error('Error fetching user data:', error);
          // If fetching fails, the token might be invalid, so log the user out
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          setIsLoggedIn(false);
          setActiveTab('account');
        }
      } else {
        setIsLoggedIn(false);
        setActiveTab('account');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserData({ name: '', email: '', school: '' });
    navigate("/login");
  };

  const handleUpdateSchool = async () => {
    if (!schoolInput.trim()) {
      setError("School name cannot be empty.");
      return;
    }
    setError('');
    setSuccess('');

    try {
      console.log('Attempting to update school...');
      const token = localStorage.getItem('token');
      
      // Create a more detailed options object with explicit CORS settings
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'omit', // Don't send cookies for cross-origin requests
        body: JSON.stringify({ school: schoolInput })
      };

      // Use the endpoint that works in production
      console.log(`Sending request to endpoint: ${API_URL}/api/school-update`);
      const response = await fetch(`${API_URL}/api/school-update`, requestOptions);
      console.log('Endpoint response status:', response.status);

      // Check for network errors or failed responses
      if (!response.ok) {
        let errorMessage = `Server returned ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Could not parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Update successful:', data.message);
      
      // Update token and user data
      localStorage.setItem('token', data.token);

      // Use the user data directly from the response to update the state
      if (data.user) {
        console.log('Updating state with user data from response:', data.user);
        setUserData({
          name: data.user.name,
          email: data.user.email,
          school: data.user.school || ''
        });
      } else {
        // Fallback to decoding the token if user object is not in response
        const decoded = jwtDecode(data.token);
        setUserData({
          name: decoded.name,
          email: decoded.email,
          school: decoded.school || ''
        });
      }

      setSuccess('School updated successfully!');
      setIsEditingSchool(false);
    } catch (error) {
      console.error('School update error:', error);
      setError(error.message || 'Failed to update school. Please try again later.');
    }
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        if (!isLoggedIn) return null;
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 style={styles.contentTitle}>User Profile</h2>
            <p style={styles.contentSubtitle}>View and manage your account details.</p>
            
            <div style={styles.settingItem}>
              <div style={styles.settingText}>
                <h4>Name</h4>
                <p>{userData.name}</p>
              </div>
            </div>
            <div style={styles.settingItem}>
              <div style={styles.settingText}>
                <h4>Email</h4>
                <p>{userData.email}</p>
              </div>
            </div>
            <div style={styles.settingItem}>
              <div style={styles.settingText}>
                <h4>School</h4>
                {isEditingSchool ? (
                  <input
                    type="text"
                    value={schoolInput}
                    onChange={(e) => setSchoolInput(e.target.value)}
                    style={styles.inputField}
                  />
                ) : (
                  <p>{userData.school || 'Not set'}</p>
                )}
              </div>
              {isEditingSchool ? (
                <motion.button style={styles.actionButton} onClick={handleUpdateSchool}>
                  <FiSave style={styles.buttonIcon}/> Save
                </motion.button>
              ) : (
                <motion.button style={styles.actionButton} onClick={() => setIsEditingSchool(true)}>
                  <FiEdit style={styles.buttonIcon}/> Edit
                </motion.button>
              )}
            </div>
            {error && <p style={styles.errorMessage}>{error}</p>}
            {success && <p style={styles.successMessage}>{success}</p>}
          </motion.div>
        );
      case 'account':
        return (
          <motion.div
            key="account"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 style={styles.contentTitle}>Account Settings</h2>
            <p style={styles.contentSubtitle}>
              {isLoggedIn 
                ? "Manage your account security and preferences." 
                : "Access your account or create a new one to save your progress."}
            </p>
            
            {!isLoggedIn && (
              <>
                <div style={styles.settingItem}>
                  <div style={styles.settingText}>
                    <h4>Sign In to Your Account</h4>
                    <p>Continue where you left off and see your speech history.</p>
                  </div>
                  <motion.button
                    style={styles.actionButton}
                    onClick={() => navigate('/login')}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(79, 172, 254, 0.9)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In
                  </motion.button>
                </div>

                <div style={styles.settingItem}>
                  <div style={styles.settingText}>
                    <h4>Create a New Account</h4>
                    <p>Join Articulate to get personalized feedback and track your improvement.</p>
                  </div>
                  <motion.button
                    style={styles.actionButton}
                    onClick={() => navigate('/signup')}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(79, 172, 254, 0.9)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Up
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.layout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
             <motion.button
              style={styles.backButton}
              onClick={() => navigate('/home')}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <FiArrowLeft /> Back to Home
            </motion.button>
          </div>
          <nav style={styles.nav}>
             {isLoggedIn && (
               <motion.a
                href="#"
                style={activeTab === 'profile' ? {...styles.navLink, ...styles.navLinkActive} : styles.navLink}
                onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)'}}
              >
                <FiUser style={styles.navIcon} />
                Profile
              </motion.a>
             )}
            <motion.a
              href="#"
              style={activeTab === 'account' ? {...styles.navLink, ...styles.navLinkActive} : styles.navLink}
              onClick={(e) => { e.preventDefault(); setActiveTab('account'); }}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)'}}
            >
              <FiSettings style={styles.navIcon} />
              Account
            </motion.a>
            {/* Add more nav links here for future settings */}
          </nav>

          {isLoggedIn && (
            <motion.button
              style={styles.logoutButton}
              onClick={handleLogout}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 82, 82, 0.2)' }}
            >
              <FiLogOut style={styles.navIcon} />
              Log Out
            </motion.button>
          )}
        </div>
        <main style={styles.mainContent}>
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(to bottom, #040913, #010209)',
    fontFamily: "'Exo', 'Inter', sans-serif",
    color: '#fff',
    overflow: 'hidden',
  },
  layout: {
    width: '100%',
    height: '100%',
    display: 'flex',
    background: 'rgba(10, 25, 47, 0.5)',
    backdropFilter: 'blur(10px)',
  },
  sidebar: {
    width: '280px',
    background: 'rgba(0, 0, 0, 0.2)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  },
  sidebarHeader: {
    marginBottom: '2rem',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  navLinkActive: {
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    color: '#fff',
  },
  navIcon: {
    fontSize: '1.1rem',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    color: 'rgba(255, 150, 150, 0.8)',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    width: '100%',
    marginTop: 'auto',
    border: '1px solid rgba(255, 82, 82, 0.3)',
    background: 'rgba(255, 82, 82, 0.1)',
    cursor: 'pointer',
  },
  mainContent: {
    flex: 1,
    padding: '4rem 5rem',
    overflowY: 'auto',
  },
  contentTitle: {
    fontSize: '2.2rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: '#fff',
  },
  contentSubtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '3rem',
    maxWidth: '500px',
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  settingText: {
    '& h4': {
      margin: '0 0 0.25rem',
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#fff',
    },
    '& p': {
      margin: 0,
      fontSize: '0.9rem',
      color: 'rgba(255, 255, 255, 0.6)',
    },
  },
  inputField: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    background: 'rgba(0, 0, 0, 0.2)',
    color: '#fff',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.3s ease',
    '&:focus': {
      borderColor: 'rgba(79, 172, 254, 0.5)',
    },
  },
  buttonIcon: {
    marginRight: '8px',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.2rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#fff',
    background: 'rgba(79, 172, 254, 0.8)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  errorMessage: {
    color: '#e74c3c',
    marginTop: 10,
    fontSize: '14px'
  },
  successMessage: {
    color: '#2ecc71',
    marginTop: 10,
    fontSize: '14px',
    fontWeight: 'bold'
  },
};

export default SettingsPage; 