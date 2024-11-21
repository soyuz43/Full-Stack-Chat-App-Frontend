// src/hooks/useMessage.js
import { useState, useEffect } from 'react';
import { getMessages, sendMessage } from '../api';

function useMessages(selectedSessionId, isLoggedIn) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedSessionId || !isLoggedIn) return;
            const data = await getMessages(selectedSessionId);
            setMessages(data.messages);
        };
        fetchMessages();
    }, [selectedSessionId, isLoggedIn]);

    const sendMessageHandler = async (tipOfTongue) => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now(), // Generate a temporary unique ID
            text: inputText,
            from_user: true, // Mark as user message
        };

        // Optimistically update the messages state with the user's input
        setMessages((prevMessages) => [userMessage, ...prevMessages]);

        try {
            // Send the message to the backend and await the assistant's response
            const response = await sendMessage(selectedSessionId, inputText, tipOfTongue);

            const assistantMessage = {
                id: Date.now() + 1, // Generate a temporary unique ID
                text: response.message,
                from_user: false, // Mark as assistant message
            };

            // Update messages state with the assistant's response
            setMessages((prevMessages) => [assistantMessage, ...prevMessages]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            // Clear the input field after sending
            setInputText("");
        }
    };

    return {
        messages,
        inputText,
        setInputText,
        sendMessageHandler,
    };
}

export default useMessages;
