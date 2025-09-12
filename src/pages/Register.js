

import React, { useState } from 'react';
import './Register.css'; // Optional: add your custom styles

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      setStatus({ success: false, message: 'Passwords do not match.' });
      return;
    }

    // TODO: Send data to your backend API
    console.log('Registering user:', formData);

    // Simulate success
    setStatus({ success: true, message: 'Registration successful! You can now sign in.' });
  };

  return (
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

        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Register;