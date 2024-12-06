// src/api.js
import axios from "axios";
import { getToken, setToken, removeToken } from "../utils/tokenManager"; // Import tokenManager functions

const API_BASE_URL = "http://127.0.0.1:8000/api/";

// Axios instance to handle requests with token
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken(); // Use tokenManager to get the token
        if (token) {
            config.headers["Authorization"] = `Token ${token}`; // Or `Bearer ${token}` if using JWT
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Login a user and store the token.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} Response data
 */
export const login = async (username, password) => {
    try {
        const response = await axiosInstance.post(`login/`, {
            username,
            password,
        });
        const token = response.data.token; // Assuming the response includes a token
        setToken(token); // Use tokenManager to store the token
        return response.data;
    } catch (error) {
        throw error.response.data; // Handle errors such as incorrect credentials or server issues
    }
};

// Logout a user and remove the token
export const logout = async () => {
    try {
        const token = getToken(); // Use tokenManager to get the token

        // If no token is found, log an error and return
        if (!token) {
            console.error("No authentication token found.");
            return { error: "No authentication token found." };
        }

        // Make the logout request with the token in the headers
        const response = await axiosInstance.post(
            `logout/`,
            {},
            {
                headers: { Authorization: `Token ${token}` }, // Use the token in the Authorization header
            }
        );

        // Remove the token using tokenManager on successful logout
        removeToken(); // Use tokenManager to remove the token
        return response.data;
    } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

// Register a new user
export const register = async (username, email, password, password2) => {
    try {
        const response = await axiosInstance.post(`register/`, {
            username,
            email,
            password,
            password2,
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Create a new session (requires authorization)
export const createSession = async () => {
    try {
        const response = await axiosInstance.post(`sessions/`); // Uses axiosInstance with token
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Get all sessions (requires authorization)
export const getSessions = async () => {
    try {
        const response = await axiosInstance.get(`sessions/all/`); // Uses axiosInstance with token
        return response.data;
    } catch (error) {
        console.error(
            "Failed to fetch sessions:",
            error.response?.data || error.message
        );
        throw error.response?.data || error.message;
    }
};

// Get session details (requires authorization)
export const getSession = async (sessionId) => {
    try {
        const response = await axiosInstance.get(`sessions/${sessionId}/`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Send a message (requires authorization)
export const sendMessage = async (sessionId, text, tipOfTongue = false) => {
    try {
        const response = await axiosInstance.post(
            `sessions/${sessionId}/messages/`,
            {
                text,
                tipOfTongue, // Include the flag in the request body
            }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Get all messages (requires authorization)
export const getMessages = async (sessionId) => {
    try {
        const response = await axiosInstance.get(
            `sessions/${sessionId}/messages/`
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Delete a session by ID (requires authorization)
export const deleteSession = async (sessionId) => {
    try {
        const response = await axiosInstance.delete(
            `sessions/${sessionId}/delete/`
        );
        return response.data;
    } catch (error) {
        console.error(
            "Failed to delete session:",
            error.response?.data || error.message
        );
        throw error.response?.data || error.message;
    }
};
