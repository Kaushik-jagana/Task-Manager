import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';  // Import AuthContext for authentication state
import '../styles/Navbar.css';

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);  
  const navigate = useNavigate();  

  
  const handleLogout = () => {
    logout();  
    navigate('/');  
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Task Manager
      </Link>
      <div className="navbar-menu">
        {!isAuthenticated ? (
          <>
            <Link to="/" className="navbar-item">
              Login
            </Link>
            <Link to="/signup" className="navbar-item">
              Signup
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} className="navbar-item">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
