// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ChatInterface from './components/ChatInterface';
import NodeInterface from './components/Node-Interface/NodeInterface';
import Header from './Header';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoutes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<ChatInterface />} />
            <Route path="/node-interface" element={<NodeInterface />} /> {/* New route */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
