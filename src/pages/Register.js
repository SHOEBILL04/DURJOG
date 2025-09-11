import React, { useState } from 'react';
import EmergencyForm from '../Components/EmergencyForm/EmergencyForm';
import './ReportPage.css';

const ReportPage = () => {
  const [submitStatus, setSubmitStatus] = useState({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    message: ''
  });

  // Replace with your actual API endpoint
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const submitEmergencyReport = async (emergencyData) => {
    const token = localStorage.getItem('token'); // Assuming you store JWT token in localStorage
    
    const response = await fetch(`${API_BASE_URL}/emergencies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(emergencyData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit emergency report');
    }
    
    return response.json();
  };

  const handleReportSubmit = async (emergency) => {
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
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else if (errorMessage.includes('token') || errorMessage.includes('auth')) {
        errorMessage = 'Please log in to report an emergency.';
      }
      
      setSubmitStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: errorMessage
      });
    }
  };

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