// src/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './api'; // Adjust based on your API function
import { AuthContext } from './context/AuthContext';


function Login() {
  const { handleLoginSuccess } = useContext(AuthContext); // Using handleLoginSuccess from AuthContext
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.token); // Store the token
      handleLoginSuccess(); // Update login state via context
      navigate('/'); // Redirect to the main chat interface
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default Login;
