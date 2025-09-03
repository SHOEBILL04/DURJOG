 partha-dev
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Register.css';

export default function Register() {
  return (
    <div className="auth-shell reverse">
      {/* Left form card */}
      <div className="auth-card">
        <div className="auth-logo" aria-hidden />
        <h2 className="auth-title">Tell us about yourself!</h2>

        <form className="auth-form grid-two">
          <label className="field">
            <span className="label">First Name</span>
            <input type="text" placeholder="Enter First Name" required />
          </label>

          <label className="field">
            <span className="label">Last Name</span>
            <input type="text" placeholder="Enter Last Name" required />
          </label>

          <label className="field wide">
            <span className="label">Home Address</span>
            <input type="text" placeholder="Enter Home Address" required />
          </label>

          <label className="field">
            <span className="label">Province</span>
            <select defaultValue="">
              <option value="" disabled>Select Province</option>
              <option>Dhaka</option>
              <option>Chattogram</option>
              <option>Khulna</option>
            </select>
          </label>

          <label className="field">
            <span className="label">District</span>
            <input type="text" placeholder="Select District" />
          </label>

          <label className="field">
            <span className="label">City</span>
            <input type="text" placeholder="Select City" />
          </label>

          <label className="field">
            <span className="label">NIC</span>
            <input type="text" placeholder="Enter Identity Number" />
          </label>

          <label className="field">
            <span className="label">Mobile Number</span>
            <input type="tel" placeholder="Enter Mobile Number" />
          </label>

          <button type="submit" className="auth-primary wide">Next</button>

          <p className="switch-text">
            Already have an account? <NavLink to="/signin">Sign in</NavLink>
          </p>
        </form>
      </div>

      {/* Right visual panel */}
      <div className="auth-visual">
        <div className="hero-overlay">
          <h2 className="hero-headline">Together<br />We are Stronger</h2>
          <p className="hero-sub">Be a part of our Community</p>

          <div className="hero-cta">
            <span>Already have an account?</span>
            <NavLink to="/signin" className="hero-cta-btn">Sign in</NavLink>
          </div>
        </div>
        <img
          src="/hero-register.jpg"
          alt=""
          className="hero-media"
        />

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import logo from '../assets/icon.png';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/signin');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <img src={logo} alt="Durjog" className="register-logo" />
        <h1>Register for <span>Durjog</span></h1>
        <p>Create an account to join the community and contribute.</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
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
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
          <button type="submit" className="btn primary">
            Register
          </button>
        </form>
        <p>
          Already have an account?{' '}
          <a href="/signin" className="link">
            Sign in here
          </a>
        </p>
 main
      </div>
    </div>
  );
}
 partha-dev


export default Register;
 main
