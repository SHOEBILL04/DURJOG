import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom emergency icons
const createEmergencyIcon = (urgency, type) => {
  const color = getColorByUrgency(urgency);
  const iconHtml = getIconByType(type);
  
  return L.divIcon({
    className: 'custom-emergency-marker',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${iconHtml}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const getColorByUrgency = (urgency) => {
  switch (urgency) {
    case 'critical': return '#ff0000';
    case 'high': return '#ff5252';
    case 'medium': return '#ff7b7b';
    case 'low': return '#ffabab';
    default: return '#ff7b7b';
  }
};

const getIconByType = (type) => {
  switch (type) {
    case 'flood': return '🌊';
    case 'earthquake': return '🌋';
    case 'fire': return '🔥';
    case 'medical': return '🚑';
    case 'blood': return '💉';
    default: return '⚠️';
  }
};

const Map = ({ emergencyReports, selectedReport, onReportSelect }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([23.8103, 90.4125], 10); // Default to Bangladesh
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);
    }
    
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstance.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers for each emergency report
    if (Array.isArray(emergencyReports)) {
      emergencyReports.forEach(report => {
        if (report.location && report.location.latitude && report.location.longitude) {
          const icon = createEmergencyIcon(report.urgency, report.type);
          const marker = L.marker(
            [report.location.latitude, report.location.longitude],
            { icon }
          ).addTo(mapInstance.current);
          
          const popupContent = `
            <div class="emergency-popup">
              <h3>${report.type.toUpperCase()} EMERGENCY</h3>
              <p class="urgency-tag ${report.urgency}">${report.urgency.toUpperCase()}</p>
              <p>${report.description || 'No description provided'}</p>
              <p class="report-time">Reported: ${new Date(report.timestamp).toLocaleString()}</p>
            </div>
          `;
          
          marker.bindPopup(popupContent);
          marker.reportId = report._id;
          markersRef.current.push(marker);
          
          marker.on('click', () => {
            onReportSelect(report);
          });
          
          // If this is the selected report, open its popup
          if (selectedReport && selectedReport._id === report._id) {
            marker.openPopup();
          }
        }
      });

      // If there's a selected report, pan to it
      if (selectedReport && selectedReport.location) {
        mapInstance.current.panTo([
          selectedReport.location.latitude,
          selectedReport.location.longitude
        ]);
      }
    }
  }, [emergencyReports, selectedReport, onReportSelect]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default Map;