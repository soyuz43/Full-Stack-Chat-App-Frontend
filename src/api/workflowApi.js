// src/api/workflowApi.js

const API_BASE_URL = "http://127.0.0.1:8000/api/";

/**
 * Saves the current workflow to the backend.
 * @param {string} token - User authentication token.
 * @param {string} sessionId - ID of the selected session.
 * @param {Object} workflow - The workflow data containing nodes and edges.
 * @returns {Promise<void>}
 */
export const saveWorkflow = async (token, sessionId, workflow) => {
    if (!token || !sessionId) {
        throw new Error("User token or session ID is missing.");
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}save-workflow/${sessionId}/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(workflow),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error saving workflow:", errorData);
            throw new Error("Failed to save workflow");
        }

        console.log("Workflow saved successfully");
    } catch (error) {
        console.error("Error saving workflow:", error);
        throw error;
    }
};

/**
 * Loads the workflow from the backend.
 * @param {string} token - User authentication token.
 * @param {string} sessionId - ID of the selected session.
 * @returns {Promise<Object>} - Returns the workflow data.
 */
export const loadWorkflow = async (token, sessionId) => {
    if (!token || !sessionId) {
        throw new Error("User token or session ID is missing.");
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}get-workflow/${sessionId}/`,
            {
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to load workflow:", errorData);
            throw new Error("Failed to load workflow");
        }

        const data = await response.json();
        console.log("Parsed response data:", data);
        return data;
    } catch (error) {
        console.error("Error loading workflow:", error);
        throw error;
    }
};
