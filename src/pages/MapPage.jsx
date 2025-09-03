import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userLocations = [
  // Gulshan (High concentration)
  { lat: 23.7925, lng: 90.4155 }, { lat: 23.7923, lng: 90.4158 },
  { lat: 23.7927, lng: 90.4152 }, { lat: 23.7920, lng: 90.4160 },
  { lat: 23.7928, lng: 90.4150 }, { lat: 23.7918, lng: 90.4145 },
  
  //  AUST(Medium concentration)
  { lat: 23.76341, lng: 90.40655 }, { lat: 23.76416, lng: 90.40657 },
  { lat: 23.76371, lng: 90.40672 }, { lat: 23.76385, lng: 90.40668 },
  
  // Kushtia (High concentration)
  { lat: 23.9025, lng: 89.1200 },
  { lat: 23.9030, lng: 89.1195 },
  { lat: 23.9020, lng: 89.1205 },
  { lat: 23.9015, lng: 89.1210 },
  { lat: 23.9035, lng: 89.1185 },
  { lat: 23.9040, lng: 89.1170 },

  
// Panchagarh (Medium concentration)
{ lat: 26.3400, lng: 88.5800 },
{ lat: 26.3405, lng: 88.5795 },
{ lat: 26.3395, lng: 88.5805 },
{ lat: 26.3390, lng: 88.5810 },

  
  // Chittagong (High concentration)
  { lat: 22.3569, lng: 91.7832 },
  { lat: 22.3575, lng: 91.7825 }, 
  { lat: 22.3555, lng: 91.7840 },
  { lat: 22.3540, lng: 91.7850 },
  { lat: 22.3585, lng: 91.7810 },
  
  // Bogura (Medium concentration)
  { lat: 24.8500, lng: 89.3750 },
  { lat: 24.8495, lng: 89.3745 },
  { lat: 24.8505, lng: 89.3755 },
  { lat: 24.8500, lng: 89.3750 },
  { lat: 24.8495, lng: 89.3745 },
  { lat: 24.8505, lng: 89.3755 },

  // Mohammadpur (Low concentration)
  { lat: 23.7630, lng: 90.3580 }, { lat: 23.7625, lng: 90.3575 },
  
  // Sylhet (Low concentration)
  { lat: 24.84434, lng: 91.90001 }, { lat: 24.84315, lng: 91.91461 },
  
  // Kishoreganj (Medium concentration)
  { lat: 24.4350, lng: 90.7850 },
  { lat: 24.4345, lng: 90.7845 },
  { lat: 24.4355, lng: 90.7855 },

];

function clusterLocations(locations, precision = 3) {
  const clusters = {};
  const precisionFactor = Math.pow(10, precision);
  
  locations.forEach(({ lat, lng }) => {
    const roundedLat = Math.round(lat * precisionFactor) / precisionFactor;
    const roundedLng = Math.round(lng * precisionFactor) / precisionFactor;
    const key = `${roundedLat}_${roundedLng}`;
    
    if (!clusters[key]) {
      clusters[key] = { 
        lat: roundedLat, 
        lng: roundedLng, 
        count: 0
      };
    }
    clusters[key].count += 1;
  });
  
  return Object.values(clusters);
}

export default function Heatmap() {
  const clusters = clusterLocations(userLocations, 3);

  const radiusScale = (count) => 10 + Math.sqrt(count) * 6;
  const colorScale = (count) => {
    const intensity = Math.min(1, count / 6);
    return `rgba(255, ${Math.round(100 * (1 - intensity))}, 0, ${0.6 + intensity * 0.3})`;
  };

  return (
    <div style={{ 
      height: '90vh', 
      width: '100%',
      backgroundColor: '#f0f0f0'
    }}>
      <MapContainer
        center={[23.8103, 90.4125]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {clusters.map(({ lat, lng, count }, idx) => (
          <CircleMarker
            key={`cluster-${idx}`}
            center={[lat, lng]}
            radius={radiusScale(count)}
            pathOptions={{
              fillColor: colorScale(count),
              fillOpacity: 0.9,
              color: 'transparent',
              weight: 0
            }}
          >
            {count > 2 && (
              <Tooltip direction="top" opacity={1} permanent={false}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {count} users
                </div>
              </Tooltip>
            )}
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}