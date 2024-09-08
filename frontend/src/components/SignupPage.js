import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../styles/SignupPage.css';

function SignupPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            await api.post('/api/users/register', {
                name: `${firstName} ${lastName}`,
                email,
                password,
            });
            alert('Signup successful. You can now log in.');
            navigate('/');
        } catch (err) {
            alert('Signup failed. Please try again.');
        }
    };



    const handleGoogleSignup = () => {
        window.location.href = 'https://task-manager-3v8m.onrender.com/auth/google';
    };

    return (
        <div className="signup-container">
            <h2>Signup</h2>
            <form onSubmit={handleSignup} className="signup-form">
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit" className="signup-btn">Signup</button>
                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
                <button type="button" className="google-signup-btn" onClick={handleGoogleSignup}>
                    Signup with Google
                </button>
            </form>
        </div>
    );
}

export default SignupPage;
