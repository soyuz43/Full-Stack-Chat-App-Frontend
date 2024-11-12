// src/hooks/useMessages.js
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

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;
        await sendMessage(selectedSessionId, inputText);
        setInputText("");
        await getMessages(selectedSessionId).then(data => setMessages(data.messages));
    };

    return {
        messages,
        inputText,
        setInputText,
        handleSendMessage,
    };
}

export default useMessages;
