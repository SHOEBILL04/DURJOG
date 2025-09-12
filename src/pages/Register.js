import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    location: '',
    picture: '',
  });

  const [status, setStatus] = useState({
    success: null,
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setStatus({ success: false, message: 'Passwords do not match.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ success: true, message: 'Registration successful! You can now sign in.' });
      } else {
        setStatus({ success: false, message: data.message || 'Registration failed.' });
      }
    } catch (err) {
      setStatus({ success: false, message: 'An error occurred during registration.' });
    }
  };

  return (
    <div className="register-page">
      <div className="overlay"></div>
      <div className="register-container">
        <h2>Create an Account</h2>

        {status.message && (
          <div className={`status-message ${status.success ? 'success' : 'error'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="text" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input 
              type="text" 
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Profile Picture URL</label>
            <input 
              type="text" 
              name="picture"
              value={formData.picture}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="register-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
