// src/components/ChatInterface.jsx
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown"; 
import remarkGfm from "remark-gfm"; 
import rehypeSanitize from "rehype-sanitize"; 
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { AuthContext } from "../context/AuthContextBase";
import useMessages from "../hooks/useMessage";
import SessionList from "./SessionList";
import "./ChatInterface.css";

function ChatInterface() {
    const {
        sessions,
        selectedSessionId,
        handleCreateSession,
        handleDeleteSession,
        setSelectedSessionId,
    } = useContext(AuthContext); // Retrieve AuthContext values for session management

    const [tipOfTongue, setTipOfTongue] = useState(false);
    const { messages, inputText, setInputText, sendMessageHandler } =
        useMessages(selectedSessionId, true);

    const handleSendClick = () => {
        sendMessageHandler(tipOfTongue);
        setInputText("");
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessageHandler(tipOfTongue);
            setInputText("");
        }
    };

    return (
        <div className="chat-container">
            <SessionList
                sessions={sessions}
                selectedSessionId={selectedSessionId}
                handleSessionSelect={setSelectedSessionId}
                className="session-list"
            />
            <div className="chat-main">
                <h1 className="chat-title">Chat with AI</h1>
                <button
                    className="create-session-btn"
                    onClick={handleCreateSession}
                >
                    Create New Session
                </button>
                {/* Pass the selected session ID to AuthContext before navigating */}
                {selectedSessionId && (
                    <Link
                        to="/node-interface"
                        className="node-interface-link"
                        onClick={() => setSelectedSessionId(selectedSessionId)} // Ensure the selectedSessionId is set
                    >
                        Go to Node Interface
                    </Link>
                )}
                {selectedSessionId && (
                    <div className="session-details">
                        <h2 className="session-id">
                            Session ID: {selectedSessionId}
                        </h2>
                        <button
                            className="delete-session-btn"
                            onClick={() =>
                                handleDeleteSession(selectedSessionId)
                            }
                        >
                            Delete This Session
                        </button>
                        <div className="message-list">
                            {messages
                                .slice()
                                .reverse()
                                .map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={
                                            msg.from_user
                                                ? "message-right"
                                                : "message-left"
                                        }
                                    >
                                        <strong>
                                            {msg.from_user
                                                ? "You"
                                                : "Assistant"}
                                            :
                                        </strong>{" "}
                                        {msg.from_user ? (
                                            msg.text
                                        ) : (
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[rehypeSanitize]}
                                                components={{
                                                    // Customize how code blocks are rendered
                                                    code({ inline, className, children, ...props }) {
                                                        const match = /language-(\w+)/.exec(className || '');
                                                        return !inline && match ? (
                                                            <SyntaxHighlighter
                                                                style={oneDark}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                {...props}
                                                            >
                                                                {String(children).replace(/\n$/, '')}
                                                            </SyntaxHighlighter>
                                                        ) : (
                                                            <code className={className} {...props}>
                                                                {children}
                                                            </code>
                                                        );
                                                    }
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        )}
                                    </div>
                                ))}
                        </div>
                        <div className="input-container">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="input-field"
                                placeholder="Type a message..."
                            />
                            <button
                                className="send-btn"
                                onClick={handleSendClick}
                                disabled={!selectedSessionId}
                            >
                                Send
                            </button>
                        </div>
                        <div className="tip-of-tongue-container">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={tipOfTongue}
                                    onChange={(e) =>
                                        setTipOfTongue(e.target.checked)
                                    }
                                />
                                It&apos;s on the tip of my tongue
                            </label>
                        </div>
                    </div>
                )}
                {!selectedSessionId && (
                    <p className="no-session-text">
                        Select a session or create a new one to start chatting.
                    </p>
                )}
            </div>
        </div>
    );
}

export default ChatInterface;
