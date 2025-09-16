// Profile.js
import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) {
      setProfile(JSON.parse(savedUser));
    }
  }, []);

  if (!profile)
    return (
      <p style={{ padding: '2rem', color: '#fff', textAlign: 'center' }}>
        No profile found. Please log in.
      </p>
    );

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      
      {/* Show profile picture or dummy image */}
      <img
        src={profile.picture || 'https://i.ytimg.com/vi/D5ue1K9_7rg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAjnLI_BrwTq4JEmW68RqO3qnf-uw'}
        alt="Profile"
        className="profile-pic"
      />

      <p><strong>Full Name:</strong> {profile.fullName || 'N/A'}</p>
      <p><strong>Username:</strong> {profile.username || 'N/A'}</p>
      <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
      <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
      <p><strong>Location:</strong> {profile.location || 'N/A'}</p>
    </div>
  );
};

export default Profile;
