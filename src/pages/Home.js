import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import logo from '../assets/icon.png';
import MapPage from './MapPage';
partha-dev
import {ContactPage} from './ContactPage';
import './Home.css'; 


import { ContactPage } from './ContactPage';
import background from '../assets/background.jpg';
import './Home.css';
 main

export function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, username, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/signin');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

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
        {isLoggedIn ? (
          <li className="profile-dropdown" ref={dropdownRef}>
            <button className="nav-item profile-btn" onClick={toggleDropdown}>
              {username} ▼
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={handleLogout} className="dropdown-item">
                  Logout
                </button>
              </div>
            )}
          </li>
        ) : (
          <>
            <li>
              <NavLink to="/signin" className="nav-item">
                Sign In
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className="nav-item register-btn">
                Register
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

 partha-dev


 main
export function Home() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="hero-text">
        <h1>
          Together, We're Stronger <br />
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
 partha-dev

 main
      <div className="hero-image">
        <img src={background} alt="Background" />
      </div>
    </div>
  );
}

 partha-dev

=======
main
export function Updates() {
  return <h2 style={{ padding: '2rem' }}>Latest Updates</h2>;
}

export function Map() {
  return <MapPage />;
}

export function Contact() {
 partha-dev
  return <ContactPage/>;
}

  return <ContactPage />;
}
 main
