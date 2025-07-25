import React from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Sample user locations - replace with your actual data
const userLocations = [
  { lat: 23.8103, lng: 90.4125 }, { lat: 23.7925, lng: 90.4155 },
  { lat: 23.7450, lng: 90.3750 }, { lat: 22.3569, lng: 91.7832 },
  { lat: 24.8949, lng: 91.8687 }, { lat: 24.3745, lng: 88.6042 },
  { lat: 22.8456, lng: 89.5403 }, { lat: 22.7010, lng: 90.3535 },
  { lat: 25.7439, lng: 89.2752 }, { lat: 24.7471, lng: 90.4203 }
];

// Create clusters with adaptive precision
const createClusters = (locations) => {
  const clusters = {};
  const precision = locations.length > 100 ? 3 : 4; // Adaptive precision
  
  locations.forEach(({ lat, lng }) => {
    const key = `${lat.toFixed(precision)}_${lng.toFixed(precision)}`;
    clusters[key] = clusters[key] || { 
      lat: parseFloat(lat.toFixed(precision)),
      lng: parseFloat(lng.toFixed(precision)),
      count: 0 
    };
    clusters[key].count++;
  });
  
  return Object.values(clusters);
};

// Cache control headers (for server-side implementation)
const cacheHeaders = {
  'Cache-Control': 'public, max-age=31536000, immutable'
};

// Main component with all compatibility fixes
export default function OptimizedHeatmap() {
  const clusters = createClusters(userLocations);
  const maxCount = Math.max(...clusters.map(c => c.count), 1);

  // Style with all vendor prefixes
  const containerStyle = {
    height: '100vh',
    width: '100%',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitPrintColorAdjust: 'exact',
    printColorAdjust: 'exact',
    backgroundColor: '#f0f0f0'
  };

  const getRadius = (count) => 6 + Math.sqrt(count) * 4;
  const getColor = (count) => {
    const intensity = Math.min(1, count / maxCount);
    return `rgb(255, ${Math.round(150 * (1 - intensity))}, 0)`;
  };

  return (
    <div style={containerStyle}>
      <MapContainer
        center={[23.6850, 90.3563]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        preferCanvas={true} // Better performance
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          crossOrigin="anonymous"
        />
        
        {clusters.map((cluster, index) => (
          <CircleMarker
            key={`cluster-${cluster.lat}-${cluster.lng}`}
            center={[cluster.lat, cluster.lng]}
            radius={getRadius(cluster.count)}
            pathOptions={{
              fillColor: getColor(cluster.count),
              fillOpacity: 0.7,
              color: 'transparent',
              weight: 0
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}