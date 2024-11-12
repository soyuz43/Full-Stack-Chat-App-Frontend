// src/Register.jsx
import React, { useState } from 'react';
import { register } from './api';
import { useNavigate } from 'react-router-dom';

function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await register(username, email, password, password2);
      onRegisterSuccess();
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      // Handle and display registration errors
      if (err.username) {
        setError(`Username: ${err.username.join(' ')}`);
      } else if (err.email) {
        setError(`Email: ${err.email.join(' ')}`);
      } else if (err.password) {
        setError(`Password: ${err.password.join(' ')}`);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
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
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />
      </div>
      <button type="submit">Register</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default Register;
