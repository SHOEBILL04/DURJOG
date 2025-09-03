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
      </div>
    </div>
  );
}
