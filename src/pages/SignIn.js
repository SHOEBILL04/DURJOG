import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './SignIn.css';
import logo from '../assets/icon.png';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user profile to localStorage for demo/testing purpose
        localStorage.setItem('userProfile', JSON.stringify(data.user));
        login(data.token, data.user.username);
        navigate('/profile');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Cannot connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestProfile = {
      fullName: 'Guest User',
      username: 'guest123',
      email: 'guest@durjog.org',
      phone: 'N/A',
      location: 'Unknown',
      picture: '', // Optional: add default guest image
    };

    localStorage.setItem('userProfile', JSON.stringify(guestProfile));
    login('guest-token', guestProfile.username); // Fake token
    navigate('/profile');
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <img src={logo} alt="Durjog" className="signin-logo" />
        <h1>Sign In to <span>Durjog</span></h1>
        <p>Welcome back! Please sign in to your account.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="forgot-password-link">
            <a href="/forgotpassword" className="link">Forgot your password?</a>
          </div>

          <button 
            type="submit" 
            className="btn primary"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="divider">
          <span>Or</span>
        </div>

        <button 
          onClick={handleGuestLogin} 
          className="btn secondary" 
          disabled={isLoading}
        >
          Continue as Guest
        </button>

        <div className="signup-link">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="link">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;