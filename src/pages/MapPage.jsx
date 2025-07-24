import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Map from '../Components/Map/Map';
import './MapPage.css';

const MapPage = () => {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/map-data');
        setMapData(response.data);
      } catch (err) {
        setError(err.message || "Failed to load map data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading map...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <h3>Error</h3>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className="map-page-container">
      <div className="map-wrapper">
        <Map data={mapData} />
      </div>
    </div>
  );
};

export default MapPage;