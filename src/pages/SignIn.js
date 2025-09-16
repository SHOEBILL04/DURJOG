// SignIn.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './SignIn.css';
import logo from '../assets/icon.png';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // 👉 MAKE THIS CHANGE HERE
      login(data.token, data.user.username);
      localStorage.setItem('userProfile', JSON.stringify(data.user));
      navigate('/profile'); // ← replace '/' with '/profile'
    } else {
      console.error('Login error:', data.message);
      setError(data.message || 'Login failed');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    setError('An error occurred. Please try again.');
  }
};

  const handleGuestLogin = () => {
    const guestProfile = {
      fullName: 'Guest User',
      username: 'guest',
      email: 'guest@durjog.org',
      phone: 'N/A',
      location: 'Unknown',
      picture: ''
    };

    localStorage.setItem('userProfile', JSON.stringify(guestProfile));
    login('guest-token', 'guest');
    navigate('/profile');
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <img src={logo} alt="Durjog" className="signin-logo" />
        <h1>Sign In to <span>Durjog</span></h1>
        <p>Welcome back! Please sign in to your account.</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn primary">Sign In</button>
        </form>

        <button onClick={handleGuestLogin} className="btn secondary" style={{ marginTop: '1rem' }}>
          Sign in as Guest
        </button>

        <p>
          Don't have an account?{' '}
          <a href="/register" className="link">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
