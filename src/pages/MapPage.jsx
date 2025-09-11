import React, { useState, useEffect } from 'react';
import EmergencyMap from '../Components/EmergencyMap/EmergencyMap';

const MapPage = () => {
  return (
    <div className="map-page">
      <EmergencyMap />
    </div>
  );
};

export default MapPage;