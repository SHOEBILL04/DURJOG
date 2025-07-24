import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './MapPin.css';

const MapPin = ({ item }) => {
  const getPosition = () => {
    if (item.latitude && item.longitude) {
      return [item.latitude, item.longitude];
    }
    if (item.pin) {
      const [lat, lng] = item.pin.split(',').map(Number);
      return [lat, lng];
    }
    return [0, 0];
  };

  const cleanContent = (html) => {
    if (!html) return '';
    const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
    return clean.length > 100 ? `${clean.substring(0, 100)}...` : clean;
  };

  const position = getPosition();
  const imageUrl = item.images?.[0] || '/default-marker.png';

  return (
    <Marker position={position}>
      <Popup>
        <div className="popupContainer">
          <img 
            src={imageUrl} 
            alt={item.title} 
            className="popup-image"
            onError={(e) => { e.target.src = '/default-marker.png' }}
          />
          <div className="textContainer">
            <h3><Link to={`/location/${item.id}`}>{item.title}</Link></h3>
            <p>{cleanContent(item.description)}</p>
            {item.createdAt && <small>{new Date(item.createdAt).toLocaleDateString()}</small>}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapPin;