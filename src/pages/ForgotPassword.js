import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import logo from '../assets/icon.png';

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage('Reset code sent to your email. Check your inbox.');
        setStep(2);
      } else {
        setError(data.message || 'Failed to send reset code.');
      }
    } catch (err) {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!code || code.length !== 6) {
      setError('Please enter the 6-digit code sent to your email');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage('Code verified successfully.');
        setStep(3);
      } else {
        setError(data.message || 'Invalid or expired code.');
      }
    } catch (err) {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage('Password reset successfully! You can now login with your new password.');
        setTimeout(() => navigate('/signin'), 3000);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <img src={logo} alt="Durjog" className="forgot-password-logo" />
        <h1>Reset Your Password</h1>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error">{error}</div>}
        
        {step === 1 && (
          <>
            <p>Enter your email address to receive a reset code</p>
            <form onSubmit={handleSendCode}>
              <div>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
              <button type="submit" className="btn primary" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          </>
        )}
        
        {step === 2 && (
          <>
            <p>Enter the 6-digit code sent to your email</p>
            <form onSubmit={handleVerifyCode}>
              <div>
                <label htmlFor="code">Verification Code</label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  required
                  disabled={isLoading}
                />
              </div>
              <button type="submit" className="btn primary" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          </>
        )}
        
        {step === 3 && (
          <>
            <p>Enter your new password</p>
            <form onSubmit={handleResetPassword}>
              <div>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={isLoading}
                />
              </div>
              <button type="submit" className="btn primary" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
        
        <div className="back-to-login">
          <a href="/signin" className="link">Back to Sign In</a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;