// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import useSessions from '../hooks/useSession';
import { logout } from '../api';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('token'));
  });
  
  // Destructure all necessary values and functions from useSessions
  const { 
    sessions, 
    selectedSessionId, 
    handleCreateSession, 
    handleDeleteSession, 
    setSelectedSessionId, 
    fetchSessions 
  } = useSessions(isLoggedIn);

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      // Sessions will be cleared automatically via useSessions hook
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Fetch sessions whenever isLoggedIn changes to true
  useEffect(() => {
    if (isLoggedIn) {
      fetchSessions();
    }
  }, [isLoggedIn, fetchSessions]);

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      handleLoginSuccess, 
      handleLogout, 
      sessions, 
      selectedSessionId, 
      handleCreateSession, 
      handleDeleteSession, 
      setSelectedSessionId, 
      fetchSessions 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
