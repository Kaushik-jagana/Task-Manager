import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api'; 
import '../styles/LoginPage.css';  
import { AuthContext } from '../context/AuthContext';  

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  

  // Handle standard login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/users/login', { email, password });
      login(response.data.token);  
      navigate('/tasks');  
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    }
  };


  const handleGoogleLogin = () => {
    window.location.href = 'https://task-manager-3v8m.onrender.com/auth/google';
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-btn">Login</button>
        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
        <button type="button" className="google-login-btn" onClick={handleGoogleLogin}>
          Login with Google
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
