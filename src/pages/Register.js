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
      </div>
    </div>
  );
}
