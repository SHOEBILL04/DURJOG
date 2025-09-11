import React, { useState, useEffect } from 'react';
import Map from '../Map';
import './EmergencyMap.css';
import { useNavigate, useLocation } from 'react-router-dom';

const EmergencyMap = () => {
  const [emergencyReports, setEmergencyReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get current user ID from user data in localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUserId(user.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    fetchEmergencyReports();
    // Set up interval to refresh reports periodically
    const interval = setInterval(fetchEmergencyReports, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchEmergencyReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/emergency-reports');
      
      if (response.ok) {
        const reports = await response.json();
        setEmergencyReports(Array.isArray(reports) ? reports : []);
      } else {
        let errorMessage = 'Failed to fetch emergency reports';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error fetching emergency reports:', error);
      setError(error.message || 'Error loading emergency reports. Please try again later.');
      setEmergencyReports([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('You need to be logged in to delete a report.');
        window.location.href = '/signin';
        return;
      }
      
      console.log('Attempting to delete report:', reportId);
      
      const response = await fetch(`http://localhost:5000/api/emergency-reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Delete response status:', response.status);
      
      // First, check if we got a JSON response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        
        if (response.ok) {
          // Remove the report from the local state
          setEmergencyReports(prev => prev.filter(report => report._id !== reportId));
          alert('Report deleted successfully');
        } else {
          throw new Error(result.message || `Server error: ${response.status}`);
        }
      } else {
        // Handle non-JSON responses (HTML errors)
        const textResponse = await response.text();
        console.error('Server returned non-JSON response:', textResponse.substring(0, 200));
        
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          throw new Error('Your session has expired. Please log in again.');
        } else if (response.status === 404) {
          throw new Error('Report not found. It may have already been deleted.');
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      alert(`Error deleting report: ${error.message}`);
    }
  };

  // Add a debug function to test the API
  const testDeleteAPI = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found');
        return;
      }
      
      console.log('Testing DELETE API for report:', reportId);
      console.log('Token exists:', !!token);
      
      // Test the endpoint
      const testResponse = await fetch(`http://localhost:5000/api/emergency-reports/${reportId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Test response status:', testResponse.status);
      const testContent = await testResponse.text();
      console.log('Test response content (first 200 chars):', testContent.substring(0, 200));
      
    } catch (error) {
      console.error('Test failed:', error);
    }
  };

  const getMarkerColor = (urgency) => {
    switch (urgency) {
      case 'critical': return '#ff0000';
      case 'high': return '#ff5252';
      case 'medium': return '#ff7b7b';
      case 'low': return '#ffabab';
      default: return '#ff7b7b';
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'flood': return '🌊';
      case 'earthquake': return '🌋';
      case 'fire': return '🔥';
      case 'medical': return '🚑';
      case 'blood': return '💉';
      default: return '⚠️';
    }
  };

  return (
    <div className="emergency-map-page">
      <div className="map-tabs">
        <button 
          className={`map-tab ${location.pathname === '/map' ? 'active' : ''}`}
          onClick={() => navigate('/map')}
        >
          Emergency Map
        </button>
        <button 
          className={`map-tab ${location.pathname === '/report' ? 'active' : ''}`}
          onClick={() => navigate('/report')}
        >
          Report Emergency
        </button>
      </div>
      
      <div className="map-content-area">
        <div className="map-sidebar">
          <div className="map-header">
            <h1>Emergency Situations Map</h1>
            <p>Real-time emergency reports in your area</p>
            <button onClick={fetchEmergencyReports} className="refresh-btn">
              ↻ Refresh
            </button>
          </div>
          
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading emergency reports...</p>
            </div>
          )}
          
          {error && (
            <div className="error-state">
              <span>⚠️</span>
              <p>{error}</p>
              <p style={{fontSize: '12px', marginTop: '10px'}}>
                Make sure your backend server is running on port 5000
              </p>
              <button onClick={fetchEmergencyReports} className="refresh-btn">
                Try Again
              </button>
            </div>
          )}
          
          {!loading && !error && emergencyReports.length === 0 && (
            <div className="empty-state">
              <p>No active emergencies reported</p>
              <small>Be the first to report an emergency situation</small>
            </div>
          )}
          
          {!loading && !error && emergencyReports.length > 0 && (
            <div className="reports-list">
              {emergencyReports.map(report => (
                <div 
                  key={report._id} 
                  className={`report-item ${selectedReport?._id === report._id ? 'selected' : ''}`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="report-header">
                    <span className="report-icon">{getIconForType(report.type)}</span>
                    <span className="report-type">{report.type}</span>
                    <span 
                      className="urgency-badge"
                      style={{backgroundColor: getMarkerColor(report.urgency)}}
                    >
                      {report.urgency}
                    </span>
                    
                    {/* Show delete button only for reports created by the current user */}
                    {currentUserId && report.userId === currentUserId && (
                      <>
                        <button 
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteReport(report._id);
                          }}
                          title="Delete your report"
                        >
                          🗑️
                        </button>
                        <button 
                          className="debug-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            testDeleteAPI(report._id);
                          }}
                          title="Debug this report"
                          style={{fontSize: '10px', padding: '2px 5px', marginLeft: '5px'}}
                        >
                          🐛
                        </button>
                      </>
                    )}
                  </div>
                  
                  <div className="report-description">
                    {report.description || 'No description provided'}
                  </div>
                  
                  <div className="report-footer">
                    <span className="report-time">
                      {new Date(report.timestamp).toLocaleString()}
                    </span>
                    <span className="report-location">
                      📍 {report.location.latitude.toFixed(4)}, {report.location.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="map-container">
          <Map 
            emergencyReports={emergencyReports}
            selectedReport={selectedReport}
            onReportSelect={setSelectedReport}
          />
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;