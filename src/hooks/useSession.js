// src/hooks/useSessions.js
import { useState, useEffect, useCallback } from 'react';
import { getSessions, createSession, deleteSession } from '../api/api';

const useSessions = (isLoggedIn) => {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const fetchSessions = useCallback(async () => {
    console.log("Fetching sessions...");
    try {
      const data = await getSessions();
      console.log("Fetched sessions:", data.sessions);
      console.log("Session example:", data.sessions[0]);
      setSessions(data.sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSessions();
    } else {
      setSessions([]);
      setSelectedSessionId(null);
    }
  }, [isLoggedIn, fetchSessions]);

  const handleCreateSession = useCallback(async () => {
    try {
        const { session_id } = await createSession();
        console.log("Created session:", session_id);
        setSessions(prevSessions => [...prevSessions, { id: session_id }]);  // Using id to match the backend and fetched sessions
        setSelectedSessionId(session_id);
    } catch (error) {
        console.error("Error creating session:", error);
    }
}, []);


  const handleDeleteSession = useCallback(async (sessionId) => {
    try {
        console.log(`Deleting session with ID: ${sessionId}`);
        await deleteSession(sessionId);
        setSessions((prevSessions) => 
            prevSessions.filter((session) => session.id !== sessionId) // Use `id` for filtering
        );
        if (selectedSessionId === sessionId) {
            setSelectedSessionId(null); // Reset selected session
        }
        console.log(`Session with ID ${sessionId} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting session:", error);
    }
}, [selectedSessionId]);

  

  // Add this function in useSessions hook
const handleSessionSelect = useCallback((sessionId) => {
  console.log("Handling session select:", sessionId);
  setSelectedSessionId(sessionId);
}, [setSelectedSessionId]);

  return { 
    sessions, 
    selectedSessionId, 
    handleCreateSession, 
    handleDeleteSession, 
    setSelectedSessionId: handleSessionSelect, 
    fetchSessions 
  };
};

export default useSessions;
