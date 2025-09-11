import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const emergencyTypeColors = {
  flood: 'rgba(0, 0, 255, 0.7)',         // Blue for flood
  earthquake: 'rgba(139, 69, 19, 0.7)',  // Brown for earthquake
  blood: 'rgba(255, 0, 0, 0.7)',         // Red for blood
  fire: 'rgba(255, 69, 0, 0.7)',         // Orange-red for fire
  medical: 'rgba(255, 0, 255, 0.7)',     // Magenta for medical
  other: 'rgba(128, 128, 128, 0.7)'      // Gray for other
};

const severityScale = {
  low: 8,
  medium: 12,
  high: 16,
  critical: 20
};

function clusterEmergencies(emergencies, precision = 3) {
  const clusters = {};
  const precisionFactor = Math.pow(10, precision);
  
  emergencies.forEach(emergency => {
    const { lat, lng } = emergency.location;
    const roundedLat = Math.round(lat * precisionFactor) / precisionFactor;
    const roundedLng = Math.round(lng * precisionFactor) / precisionFactor;
    const key = `${roundedLat}_${roundedLng}_${emergency.type}`;
    
    if (!clusters[key]) {
      clusters[key] = { 
        lat: roundedLat, 
        lng: roundedLng, 
        count: 0,
        type: emergency.type,
        emergencies: []
      };
    }
    clusters[key].count += 1;
    clusters[key].emergencies.push(emergency);
  });
  
  return Object.values(clusters);
}

export default function MapPage() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    try {
      const response = await fetch('/api/emergencies');
      const data = await response.json();
      
      if (response.ok) {
        setEmergencies(data.emergencies);
      } else {
        setError('Failed to fetch emergencies');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const clusters = clusterEmergencies(emergencies, 3);

  if (loading) {
    return <div className="map-loading">Loading emergencies...</div>;
  }

  if (error) {
    return <div className="map-error">Error: {error}</div>;
  }

  return (
    <div className="map-page">
      <div className="map-legend">
        <h3>Emergency Types</h3>
        <div className="legend-items">
          {Object.entries(emergencyTypeColors).map(([type, color]) => (
            <div key={type} className="legend-item">
              <div className="color-box" style={{ backgroundColor: color }}></div>
              <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="map-container">
        <MapContainer
          center={[23.8103, 90.4125]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {clusters.map((cluster, idx) => (
            <CircleMarker
              key={`cluster-${idx}`}
              center={[cluster.lat, cluster.lng]}
              radius={severityScale[cluster.emergencies[0].severity] || 12}
              pathOptions={{
                fillColor: emergencyTypeColors[cluster.type] || 'rgba(128, 128, 128, 0.7)',
                fillOpacity: 0.9,
                color: 'transparent',
                weight: 0
              }}
            >
              <Tooltip direction="top" opacity={1} permanent={false}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {cluster.count} {cluster.type} emergency{cluster.count > 1 ? 's' : ''}
                </div>
              </Tooltip>
              
              <Popup>
                <div className="emergency-popup">
                  <h3>{cluster.type.charAt(0).toUpperCase() + cluster.type.slice(1)} Emergency</h3>
                  <p><strong>Count:</strong> {cluster.count} report(s)</p>
                  <p><strong>Severity:</strong> {cluster.emergencies[0].severity}</p>
                  <div className="emergency-list">
                    {cluster.emergencies.slice(0, 3).map(emergency => (
                      <div key={emergency._id} className="emergency-item">
                        <p>{emergency.description}</p>
                        <small>Reported by: {emergency.reportedBy?.username || 'Anonymous'}</small>
                      </div>
                    ))}
                    {cluster.emergencies.length > 3 && (
                      <p>And {cluster.emergencies.length - 3} more...</p>
                    )}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}