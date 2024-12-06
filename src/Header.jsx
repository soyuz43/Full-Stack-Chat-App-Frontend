// src/Header.jsx
import { useContext } from 'react'; 
import { Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContextBase';
import './Header.css'; 

function Header() {
  const { isLoggedIn, handleLogout } = useContext(AuthContext);

  return (
    <header className="header-container">
      <h1 className="header-title">My Chat App</h1>
      {isLoggedIn ? (
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      ) : (
        <div className="auth-links">
          <Link to="/login" className="login-link">Login</Link>
          <Link to="/register" className="register-link">Register</Link>
        </div>
      )}
    </header>
  );
}

export default Header;