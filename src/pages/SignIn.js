 partha-dev
import React from 'react';
import { NavLink } from 'react-router-dom';
import './SignIn.css';

export default function SignIn() {
  return (
    <div className="auth-shell">
      {}
      <div className="auth-visual">
        <div className="hero-overlay">
          <h2 className="hero-headline">Together<br />We are Stronger</h2>
          <p className="hero-sub">The Power of Community</p>

          <div className="hero-cta">
            <span>Don’t have an account?</span>
            <NavLink to="/register" className="hero-cta-btn">Register</NavLink>
          </div>
        </div>
        {}
        <img
          src="/hero-signin.jpg"
          alt=""
          className="hero-media"
        />
      </div>

      {}
      <div className="auth-card">
        <div className="auth-logo" aria-hidden />
        <h2 className="auth-title">Welcome Back!</h2>

        <form className="auth-form">
          <label className="field">
            <span className="label">Email</span>
            <input type="email" placeholder="Enter Email" required />
          </label>

          <label className="field">
            <span className="label">Password</span>
            <input type="password" placeholder="Enter Password" required />
          </label>

          <button type="submit" className="auth-primary">Sign in</button>

          <p className="switch-text">
            Don’t have an account? <NavLink to="/register">Register</NavLink>
          </p>
        </form>

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
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token, data.user.username);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
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
          <button type="submit" className="btn primary">
            Sign In
          </button>
        </form>
        <p>
          Don't have an account?{' '}
          <a href="/register" className="link">
            Register here
          </a>
        </p>
main
      </div>
    </div>
  );
}
 partha-dev


export default SignIn;
 main
