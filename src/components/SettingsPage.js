import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiArrowLeft, FiLogOut, FiEdit, FiSave, FiSettings, FiLock, FiKey } from 'react-icons/fi';
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
  
  // Password change form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token data:', decoded);
        setUserData({
          name: decoded.name || '',
          email: decoded.email || '',
          school: decoded.school || ''
        });
        setSchoolInput(decoded.school || '');
        setIsLoggedIn(true);
        setActiveTab('profile');
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsLoggedIn(false);
        setActiveTab('account');
      }
    } else {
      setActiveTab('account');
    }
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
      const decoded = jwtDecode(data.token);
      setUserData({
        name: decoded.name,
        email: decoded.email,
        school: decoded.school || ''
      });
      setSuccess('School updated successfully!');
      setIsEditingSchool(false);
    } catch (error) {
      console.error('School update error:', error);
      setError(error.message || 'Failed to update school. Please try again later.');
    }
  };
  
  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    
    // Clear any previous errors for this field
    setPasswordErrors({
      ...passwordErrors,
      [name]: ''
    });
    
    // Clear success message when user starts typing
    if (success) setSuccess('');
  };
  
  // Validate password form
  const validatePasswordForm = () => {
    let isValid = true;
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      isValid = false;
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setPasswordErrors(errors);
    return isValid;
  };
  
  // Handle password update submission
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password.');
      }
      
      // Reset form and show success message
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSuccess('Your password has been updated successfully.');
      
    } catch (error) {
      setError(error.message);
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
            
            {isLoggedIn ? (
              // Password change form for logged in users
              <div style={styles.formContainer}>
                <h3 style={styles.formTitle}>
                  <FiLock style={{marginRight: '10px'}} />
                  Change Password
                </h3>
                
                <form onSubmit={handleUpdatePassword} style={styles.form}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Current Password</label>
                    <input 
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      style={styles.inputField}
                      placeholder="Enter your current password"
                    />
                    {passwordErrors.currentPassword && (
                      <p style={styles.fieldError}>{passwordErrors.currentPassword}</p>
                    )}
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>New Password</label>
                    <input 
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      style={styles.inputField}
                      placeholder="Enter your new password"
                    />
                    {passwordErrors.newPassword && (
                      <p style={styles.fieldError}>{passwordErrors.newPassword}</p>
                    )}
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Confirm New Password</label>
                    <input 
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      style={styles.inputField}
                      placeholder="Confirm your new password"
                    />
                    {passwordErrors.confirmPassword && (
                      <p style={styles.fieldError}>{passwordErrors.confirmPassword}</p>
                    )}
                  </div>
                  
                  {error && <p style={styles.errorMessage}>{error}</p>}
                  {success && <p style={styles.successMessage}>{success}</p>}
                  
                  <motion.button 
                    type="submit"
                    style={styles.submitButton}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(79, 172, 254, 0.9)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiKey style={styles.buttonIcon} /> Update Password
                  </motion.button>
                </form>
              </div>
            ) : (
              // Login/signup options for non-logged in users
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
  // Password form styles
  formContainer: {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '2rem',
  },
  formTitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
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
  fieldError: {
    color: '#ff6b6b',
    fontSize: '0.85rem',
    margin: '0.25rem 0 0 0',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.85rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff',
    background: 'rgba(79, 172, 254, 0.8)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'all 0.3s ease',
  },
};

export default SettingsPage; 