// src/context/AuthContext.jsx
import { useState, useEffect } from 'react';
import useSessions from '../hooks/useSession';
import { AuthContext } from './AuthContextBase'; 
import { logout as apiLogout } from '../api';
import { getToken } from '../utils/tokenManager'; // Import getToken

// Create the context

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(getToken()); // Use getToken from tokenManager
  });

  const userToken = getToken(); // Use getToken to retrieve the token
  
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
      await apiLogout();
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
      fetchSessions,
      userToken, // Provide userToken to the context
    }}>
      {children}
    </AuthContext.Provider>
  );
};
