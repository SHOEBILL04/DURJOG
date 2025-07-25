import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Expanded user locations across Dhaka's major areas
const userLocations = [
  // Gulshan (High concentration)
  { lat: 23.7925, lng: 90.4155 }, { lat: 23.7923, lng: 90.4158 },
  { lat: 23.7927, lng: 90.4152 }, { lat: 23.7920, lng: 90.4160 },
  { lat: 23.7928, lng: 90.4150 }, { lat: 23.7918, lng: 90.4145 },
  
  // Banani (Medium concentration)
  { lat: 23.7930, lng: 90.4055 }, { lat: 23.7928, lng: 90.4060 },
  { lat: 23.7932, lng: 90.4058 }, { lat: 23.7935, lng: 90.4045 },
  
  // Dhanmondi (High concentration)
  { lat: 23.7455, lng: 90.3750 }, { lat: 23.7460, lng: 90.3745 },
  { lat: 23.7450, lng: 90.3755 }, { lat: 23.7445, lng: 90.3760 },
  { lat: 23.7465, lng: 90.3735 }, { lat: 23.7470, lng: 90.3720 },
  
  // Uttara (Medium concentration)
  { lat: 23.8675, lng: 90.3990 }, { lat: 23.8680, lng: 90.3985 },
  { lat: 23.8670, lng: 90.3995 }, { lat: 23.8665, lng: 90.4000 },
  
  // Mirpur (High concentration)
  { lat: 23.8050, lng: 90.3650 }, { lat: 23.8045, lng: 90.3645 },
  { lat: 23.8055, lng: 90.3655 }, { lat: 23.8060, lng: 90.3660 },
  { lat: 23.8035, lng: 90.3635 },
  
  // Motijheel (Medium concentration)
  { lat: 23.7330, lng: 90.4180 }, { lat: 23.7325, lng: 90.4175 },
  { lat: 23.7335, lng: 90.4185 },
  
  // Mohammadpur (Low concentration)
  { lat: 23.7630, lng: 90.3580 }, { lat: 23.7625, lng: 90.3575 },
  
  // Old Dhaka (Low concentration)
  { lat: 23.7100, lng: 90.4070 }, { lat: 23.7110, lng: 90.4080 },
  
  // Bashundhara (Medium concentration)
  { lat: 23.8150, lng: 90.4250 }, { lat: 23.8145, lng: 90.4245 },
  { lat: 23.8155, lng: 90.4255 },
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

export default function DhakaHeatmap() {
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
        center={[23.8103, 90.4125]} // Centered on Dhaka
        zoom={12} // Slightly zoomed out to see more areas
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
              color: 'transparent', // No border
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