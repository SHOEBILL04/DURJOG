import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteStatus, setDeleteStatus] = useState({});
  const navigate = useNavigate();
  const { isLoggedIn, username, logout } = useAuth();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/signin');
      return;
    }
    fetchUserData();
  }, [isLoggedIn, navigate]);

  const fetchUserData = async () => {
    try {
      await fetchUserProfile();
      await fetchUserReports();
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        // Also store in localStorage for fallback
        localStorage.setItem('userProfile', JSON.stringify(data));
        return data;
      } else {
        // Fallback to localStorage data if API fails
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          const profileData = JSON.parse(savedProfile);
          setUserProfile(profileData);
          return profileData;
        }
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to localStorage data
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        setUserProfile(profileData);
        return profileData;
      }
      throw error;
    }
  };

  const fetchUserReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/emergency-reports`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const allReports = await response.json();
        console.log('All reports from API:', allReports);
        
        // Get current user ID for filtering - wait for userProfile to be loaded
        let currentUserId = userProfile?.id;
        if (!currentUserId) {
          // If userProfile not loaded yet, try to get it
          const profileData = await fetchUserProfile();
          currentUserId = profileData?.id;
        }
        
        if (!currentUserId) {
          // Final fallback to localStorage
          const savedProfile = localStorage.getItem('userProfile');
          if (savedProfile) {
            currentUserId = JSON.parse(savedProfile)?.id;
          }
        }
        
        console.log('Current user ID for filtering:', currentUserId);
        
        if (currentUserId) {
          // Filter reports to show only those created by the current user
          const filteredReports = allReports.filter(report => {
            // Handle different ID formats (ObjectId vs string)
            const reportUserId = report.userId?._id || report.userId;
            return reportUserId && reportUserId.toString() === currentUserId.toString();
          });
          
          console.log('Filtered user reports:', filteredReports);
          setUserReports(filteredReports);
          
          // Cache in localStorage for offline viewing
          localStorage.setItem('userEmergencyReports', JSON.stringify(filteredReports));
        } else {
          console.log('No user ID found for filtering');
          setUserReports(allReports); // Fallback: show all reports
        }
      } else {
        throw new Error('Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load your reports. Please try again.');
      
      // Try to get reports from localStorage as fallback
      try {
        const savedReports = localStorage.getItem('userEmergencyReports');
        if (savedReports) {
          setUserReports(JSON.parse(savedReports));
        }
      } catch (e) {
        console.error('Error loading reports from localStorage:', e);
      }
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    setDeleteStatus(prev => ({ ...prev, [reportId]: 'deleting' }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/emergency-reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove the report from local state
        setUserReports(prev => prev.filter(report => report._id !== reportId));
        setDeleteStatus(prev => ({ ...prev, [reportId]: 'success' }));
        
        // Remove from localStorage cache
        const savedReports = localStorage.getItem('userEmergencyReports');
        if (savedReports) {
          const reports = JSON.parse(savedReports);
          const updatedReports = reports.filter(report => report._id !== reportId);
          localStorage.setItem('userEmergencyReports', JSON.stringify(updatedReports));
        }
        
        setTimeout(() => {
          setDeleteStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[reportId];
            return newStatus;
          });
        }, 2000);
      } else {
        throw new Error('Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      setDeleteStatus(prev => ({ ...prev, [reportId]: 'error' }));
      setTimeout(() => {
        setDeleteStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[reportId];
          return newStatus;
        });
      }, 3000);
    }
  };

  // ... (rest of your helper functions: formatDate, getUrgencyColor, getTypeIcon)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'flood': return '🌊';
      case 'earthquake': return '🌋';
      case 'fire': return '🔥';
      case 'medical': return '🏥';
      case 'blood': return '🩸';
      default: return '⚠️';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1>Profile</h1>
          <div className="login-required">
            <p>Please log in to view your profile.</p>
            <button onClick={() => navigate('/signin')} className="btn primary">
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Your Profile</h1>
          <p>Welcome back, {username}!</p>
        </div>

        {/* User Info Section */}
        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="user-info">
            {userProfile ? (
              <>
                <div className="info-item">
                  <label>Username:</label>
                  <span>{userProfile.username}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{userProfile.email}</span>
                </div>
                <div className="info-item">
                  <label>User ID:</label>
                  <span className="user-id">{userProfile.id}</span>
                </div>
              </>
            ) : (
              <p>Loading user information...</p>
            )}
          </div>
        </div>

        {/* Emergency Reports Section */}
        <div className="profile-section">
          <h2>Your Emergency Reports ({userReports.length})</h2>
          
          {loading ? (
            <div className="loading">Loading your reports...</div>
          ) : error ? (
            <div className="error-message">
              {error}
              <button onClick={fetchUserData} className="btn secondary" style={{marginLeft: '1rem'}}>
                Retry
              </button>
            </div>
          ) : userReports.length === 0 ? (
            <div className="no-reports">
              <p>You haven't submitted any emergency reports yet.</p>
              <button onClick={() => navigate('/report')} className="btn primary">
                Report an Emergency
              </button>
            </div>
          ) : (
            <div className="reports-list">
              {userReports.map((report) => (
                <div key={report._id} className="report-card">
                  <div className="report-header">
                    <span className="report-type">
                      {getTypeIcon(report.type)} {report.type}
                    </span>
                    <span 
                      className="urgency-badge"
                      style={{ backgroundColor: getUrgencyColor(report.urgency) }}
                    >
                      {report.urgency}
                    </span>
                  </div>
                  
                  <div className="report-content">
                    {report.description && (
                      <p className="report-description">{report.description}</p>
                    )}
                    
                    <div className="report-details">
                      <div className="detail-item">
                        <span className="label">Location:</span>
                        <span className="value">
                          {report.location?.latitude?.toFixed(4)}, {report.location?.longitude?.toFixed(4)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Reported:</span>
                        <span className="value">{formatDate(report.timestamp)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Status:</span>
                        <span className="status-badge">{report.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="report-actions">
                    <button
                      onClick={() => handleDeleteReport(report._id)}
                      disabled={deleteStatus[report._id] === 'deleting'}
                      className="btn danger"
                    >
                      {deleteStatus[report._id] === 'deleting' ? 'Deleting...' : 'Delete Report'}
                    </button>
                    
                    {deleteStatus[report._id] === 'success' && (
                      <span className="delete-success">✓ Report deleted</span>
                    )}
                    {deleteStatus[report._id] === 'error' && (
                      <span className="delete-error">Failed to delete</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className="profile-section">
          <h2>Account Actions</h2>
          <div className="account-actions">
            <button onClick={() => navigate('/report')} className="btn primary">
              Report New Emergency
            </button>
            <button onClick={fetchUserData} className="btn secondary">
              Refresh Reports
            </button>
            <button onClick={logout} className="btn secondary">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;