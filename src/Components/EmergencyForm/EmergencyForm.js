import React, { useState } from 'react';
import { useAuth } from '../../pages/AuthContext'; // Import useAuth instead of AuthContext
import './EmergencyForm.css';

const EmergencyForm = ({ onReportSubmit }) => {
  const { isLoggedIn, username } = useAuth(); // Use useAuth hook directly
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    severity: 'medium',
    location: {
      lat: '',
      lng: ''
    },
    contactInfo: {
      name: username || '',
      phone: '',
      email: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
        },
        (error) => {
          alert('Error getting location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert('Please log in to report an emergency');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/emergencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Emergency reported successfully!');
        if (onReportSubmit) onReportSubmit(data.emergency);
        setFormData({
          type: '',
          description: '',
          severity: 'medium',
          location: {
            lat: '',
            lng: ''
          },
          contactInfo: {
            name: username || '',
            phone: '',
            email: ''
          }
        });
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error submitting form: ' + error.message);
    }
  };

  return (
    <div className="emergency-form-container">
      <h2>Report Emergency</h2>
      {!isLoggedIn && (
        <div className="login-warning">
          Please log in to report an emergency
        </div>
      )}
      <form onSubmit={handleSubmit} className="emergency-form">
        <div className="form-group">
          <label>Emergency Type:</label>
          <select name="type" value={formData.type} onChange={handleChange} required disabled={!isLoggedIn}>
            <option value="">Select Type</option>
            <option value="flood">Flood</option>
            <option value="earthquake">Earthquake</option>
            <option value="blood">Blood Needed</option>
            <option value="fire">Fire</option>
            <option value="medical">Medical Emergency</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            rows="4"
            placeholder="Please provide details about the emergency"
            disabled={!isLoggedIn}
          />
        </div>

        <div className="form-group">
          <label>Severity:</label>
          <select name="severity" value={formData.severity} onChange={handleChange} disabled={!isLoggedIn}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label>Location:</label>
          <div className="location-inputs">
            <input
              type="number"
              step="any"
              name="location.lat"
              placeholder="Latitude"
              value={formData.location.lat}
              onChange={handleChange}
              required
              disabled={!isLoggedIn}
            />
            <input
              type="number"
              step="any"
              name="location.lng"
              placeholder="Longitude"
              value={formData.location.lng}
              onChange={handleChange}
              required
              disabled={!isLoggedIn}
            />
            <button type="button" onClick={getCurrentLocation} className="location-btn" disabled={!isLoggedIn}>
              Use Current Location
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Your Name:</label>
          <input
            type="text"
            name="contactInfo.name"
            value={formData.contactInfo.name}
            onChange={handleChange}
            required
            disabled={!isLoggedIn}
          />
        </div>

        <div className="form-group">
          <label>Your Phone:</label>
          <input
            type="tel"
            name="contactInfo.phone"
            value={formData.contactInfo.phone}
            onChange={handleChange}
            required
            disabled={!isLoggedIn}
          />
        </div>

        <div className="form-group">
          <label>Your Email:</label>
          <input
            type="email"
            name="contactInfo.email"
            value={formData.contactInfo.email}
            onChange={handleChange}
            disabled={!isLoggedIn}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={!isLoggedIn}>
          Report Emergency
        </button>
      </form>
    </div>
  );
};

export default EmergencyForm;