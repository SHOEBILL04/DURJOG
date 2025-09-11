import React, { useState, useEffect } from 'react';
import EmergencyForm from '../Components/EmergencyForm/EmergencyForm';
import './ReportPage.css';

const ReportPage = () => {
  const [submitStatus, setSubmitStatus] = useState({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    message: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    if (!token) {
      setSubmitStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: 'Please log in to report an emergency. You will be redirected to login page in 5 seconds.'
      });
      
      // Redirect to login after 5 seconds
      const timer = setTimeout(() => {
        window.location.href = '/signin';
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const submitEmergencyReport = async (emergencyData) => {
    console.log('Submitting data:', emergencyData);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch(`${API_BASE_URL}/api/emergency-reports`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(emergencyData)
      });
      
      console.log('Response status:', response.status);
      
      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        throw new Error('Your session has expired. Please log in again.');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Server response:', result);
      return result;
      
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  const handleReportSubmit = async (emergency) => {
    if (!isLoggedIn) {
      setSubmitStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: 'Please log in to report an emergency.'
      });
      return;
    }
    
    setSubmitStatus({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
      message: 'Submitting your report...'
    });
    
    try {
      console.log('Submitting emergency report:', emergency);
      
      // Call the API function
      const result = await submitEmergencyReport(emergency);
      
      setSubmitStatus({
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        message: result.message || 'Emergency reported successfully! It will now appear on the map.'
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      let errorMessage = error.message || 'Please check your connection and try again.';
      
      // Handle specific error cases
      if (errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please check if your backend is running on port 5000.';
      } else if (errorMessage.includes('token') || errorMessage.includes('auth') || errorMessage.includes('session')) {
        errorMessage = 'Authentication error. Please log in again.';
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
      
      setSubmitStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: errorMessage
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="report-page">
        <div className="report-container">
          <h1>Report an Emergency</h1>
          <div className="login-required">
            <p>⚠️ You need to be logged in to report an emergency.</p>
            <p>Redirecting to login page...</p>
            <button 
              className="login-btn"
              onClick={() => window.location.href = '/signin'}
            >
              Go to Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="report-container">
        <h1>Report an Emergency</h1>
        <p className="page-description">
          Use this form to report emergencies like floods, earthquakes, medical emergencies, 
          or requests for blood donations. Your report will be visible on the map to help others.
        </p>
        
        {/* Status Message */}
        {submitStatus.message && (
          <div className={`status-message ${submitStatus.isSuccess ? 'success' : ''} ${submitStatus.isError ? 'error' : ''}`}>
            <div className="message-content">
              {submitStatus.isSuccess && <div className="icon">✓</div>}
              {submitStatus.isError && <div className="icon">⚠️</div>}
              <span>{submitStatus.message}</span>
            </div>
            {submitStatus.isError && (
              <button 
                className="retry-btn"
                onClick={() => setSubmitStatus({
                  isSubmitting: false,
                  isSuccess: false,
                  isError: false,
                  message: ''
                })}
              >
                Try Again
              </button>
            )}
          </div>
        )}
        
        <EmergencyForm 
          onReportSubmit={handleReportSubmit} 
          isSubmitting={submitStatus.isSubmitting}
          isSuccess={submitStatus.isSuccess}
        />
      </div>
    </div>
  );
};

export default ReportPage;