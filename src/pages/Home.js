import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/icon.png';
import MapPage from './MapPage';
import { ContactPage } from './ContactPage';
import { Nav } from 'react-bootstrap';
import background from '../assets/background.jpg'; 
 // Import your new background image
 //import './Home.css';


export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/">
          <img src={logo} alt="Durjog" className="logo-img" />
        </NavLink>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" className="nav-item" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/updates" className="nav-item">
            News
          </NavLink>
        </li>
        <li>
          <NavLink to="/map" className="nav-item">
            Map
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className="nav-item">
            Contact
          </NavLink>
        </li>
        <li>
          <button className="nav-item" onClick={() => navigate('/signin')}>
            Sign In
          </button>
        </li>
        <li>
          <button className="nav-item primary" onClick={() => navigate('/register')}>
            Register
          </button>
        </li>
      </ul>
    </nav>
  );
}

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="hero-text">
        <h1>
          Together, We’re Stronger <br />
          <span>Durjog</span>
        </h1>
        <p className="text1">
          Durjog is built on the power of community and collaboration. In times of need,
          our platform allows you to quickly report emergencies, receive critical updates,
          and access lifesaving information.
        </p>
        <div className="buttons">
          <button className="btn primary" onClick={() => navigate('/updates')}>
            Latest Updates
          </button>
          <button className="btn" onClick={() => navigate('/map')}>
            Disaster Map
          </button>
        </div>
      </div>
      <div className="hero-image">
        {/* Changed image src from external URL to your local image */}
        <img src={background} alt="Background" />
      </div>
    </div>
  );
}

export function SignIn() {
  return <h2 style={{ padding: '2rem' }}>Sign In Page</h2>;
}

export function Register() {
  return <h2 style={{ padding: '2rem' }}>Register Page</h2>;
}

export function Updates() {
  return <h2 style={{ padding: '2rem' }}>Latest Updates</h2>;
}

export function Map() {
  return <MapPage />; // 
}

export function Contact() {
  return <ContactPage/>;
}