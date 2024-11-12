// src/Header.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

function Header() {
    const { isLoggedIn, handleLogout } = useContext(AuthContext);

    return (
        <header>
            <h1>My Chat App</h1>
            {isLoggedIn ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <div>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            )}
        </header>
    );
}

export default Header;
