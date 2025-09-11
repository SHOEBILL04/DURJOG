import React, { useState, useEffect } from 'react';
import { useAuth } from '../../pages/AuthContext';
import './EmergencyForm.css';

const EmergencyForm = ({ onReportSubmit, isSubmitting, isSuccess }) => {
  const { isLoggedIn, username } = useAuth();
  const [emergencyType, setEmergencyType] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [locationError, setLocationError] = useState('');
  const [locationMethod, setLocationMethod] = useState('auto');
  const [manualLatitude, setManualLatitude] = useState('');
  const [manualLongitude, setManualLongitude] = useState('');
  const [locationAccess, setLocationAccess] = useState(null); // null, 'granted', 'denied', 'unsupported'

  // Check if geolocation is supported
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationAccess('unsupported');
      setLocationMethod('manual');
    }
  }, []);

  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationAccess('unsupported');
      setLocationMethod('manual');
      return false;
    }

    try {
      // Test geolocation permission
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { timeout: 5000 }
        );
      });
      
      setLocationAccess('granted');
      return true;
    } catch (error) {
      setLocationAccess('denied');
      setLocationError('Location access denied. Please use manual coordinates or enable location permissions in your browser settings.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert('Please log in to submit an emergency report');
      return;
    }
    
    setLocationError('');
    
    try {
      let locationData;
      
      if (locationMethod === 'auto') {
        // Request location permission if not already granted
        if (locationAccess !== 'granted') {
          const hasPermission = await requestLocationPermission();
          if (!hasPermission) {
            return; // Stop submission if permission denied
          }
        }
        
        // Get user's current location automatically
        const position = await getCurrentLocation();
        locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      } else {
        // Use manually entered location
        if (!manualLatitude || !manualLongitude) {
          throw new Error('Please enter both latitude and longitude coordinates');
        }
        
        const lat = parseFloat(manualLatitude);
        const lng = parseFloat(manualLongitude);
        
        if (isNaN(lat) || isNaN(lng)) {
          throw new Error('Please enter valid numeric coordinates');
        }
        
        if (lat < -90 || lat > 90) {
          throw new Error('Latitude must be between -90 and 90');
        }
        
        if (lng < -180 || lng > 180) {
          throw new Error('Longitude must be between -180 and 180');
        }
        
        locationData = {
          latitude: lat,
          longitude: lng
        };
      }
      
      const reportData = {
        type: emergencyType,
        description,
        urgency,
        location: locationData
      };
      
      if (onReportSubmit) {
        await onReportSubmit(reportData);
        
        // Reset form on success
        if (isSuccess) {
          setEmergencyType('');
          setDescription('');
          setUrgency('medium');
          setManualLatitude('');
          setManualLongitude('');
        }
      }
    } catch (error) {
      console.error('Error submitting emergency report:', error);
      if (error.message.includes('geolocation')) {
        setLocationError('Unable to get your location. Please enable location services or use manual entry.');
      } else {
        alert(`Error submitting report: ${error.message}`);
      }
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        });
      }
    });
  };

  const handleAutoLocationSelect = async () => {
    setLocationMethod('auto');
    setLocationError('');
    
    if (locationAccess === 'denied') {
      setLocationError('Location access was previously denied. Please enable location permissions in your browser settings or use manual coordinates.');
    } else if (locationAccess === 'unsupported') {
      setLocationError('Geolocation is not supported by your browser. Please use manual coordinates.');
      setLocationMethod('manual');
    }
  };

  return (
    <div className="emergency-form-container">
      <h2>Report Emergency Situation</h2>
      <p className="form-subtitle">Please provide details about the emergency. Your report will be visible to authorities and other users.</p>
      
      {locationError && (
        <div className="error-message">
          <span>⚠️</span> {locationError}
        </div>
      )}
      
      {locationMethod === 'auto' && locationAccess !== 'granted' && (
        <div className="location-permission-note">
          <p>📍 <strong>Location Access Required</strong></p>
          <p>This application needs access to your location to accurately report emergencies. Please allow location access when prompted.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="emergencyType">Emergency Type *</label>
          <select
            id="emergencyType"
            value={emergencyType}
            onChange={(e) => setEmergencyType(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Select emergency type</option>
            <option value="flood">Flood</option>
            <option value="earthquake">Earthquake</option>
            <option value="fire">Fire</option>
            <option value="medical">Medical Emergency</option>
            <option value="blood">Need Blood</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide details about the emergency (what you see, number of people affected, immediate dangers)..."
            rows="4"
            required
            className="form-textarea"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="urgency">Urgency Level *</label>
          <select
            id="urgency"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            required
            className="form-select"
          >
            <option value="low">Low - Monitoring situation</option>
            <option value="medium">Medium - Assistance needed</option>
            <option value="high">High - Immediate danger</option>
            <option value="critical">Critical - Life-threatening</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Location Method *</label>
          <div className="location-method">
            <label className="radio-label">
              <input
                type="radio"
                value="auto"
                checked={locationMethod === 'auto'}
                onChange={handleAutoLocationSelect}
              />
              Use my current location (Recommended for accuracy)
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="manual"
                checked={locationMethod === 'manual'}
                onChange={() => setLocationMethod('manual')}
              />
              Enter coordinates manually
            </label>
          </div>
        </div>
        
        {locationMethod === 'manual' && (
          <div className="form-group manual-location">
            <div className="coordinates-input">
              <div>
                <label htmlFor="latitude">Latitude *</label>
                <input
                  type="text"
                  id="latitude"
                  value={manualLatitude}
                  onChange={(e) => setManualLatitude(e.target.value)}
                  placeholder="e.g., 23.8103"
                  required={locationMethod === 'manual'}
                />
              </div>
              <div>
                <label htmlFor="longitude">Longitude *</label>
                <input
                  type="text"
                  id="longitude"
                  value={manualLongitude}
                  onChange={(e) => setManualLongitude(e.target.value)}
                  placeholder="e.g., 90.4125"
                  required={locationMethod === 'manual'}
                />
              </div>
            </div>
            <p className="location-help">
              💡 You can find coordinates using Google Maps: Right-click on a location and select "What's here?"
            </p>
          </div>
        )}
        
        <div className="form-footer">
          <p className="location-note">
            {locationMethod === 'auto' 
              ? '📍 Your current location will be automatically included with this report'
              : '📍 The coordinates you provide will be used for this report'
            }
          </p>
          
          <button 
            type="submit" 
            disabled={isSubmitting || !emergencyType || !description}
            className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Submitting...
              </>
            ) : (
              'Submit Emergency Report'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmergencyForm;