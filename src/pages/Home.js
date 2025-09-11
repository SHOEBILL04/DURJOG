import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import logo from '../assets/icon.png';
import MapPage from './MapPage';
import { ContactPage } from './ContactPage';
import background from '../assets/background.jpg';
import './Home.css';

export function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, username, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      
      // Close mobile menu if clicked outside
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          !event.target.classList.contains('hamburger')) {
        setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
    navigate('/signin');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
          <img src={logo} alt="Durjog" className="logo-img" />
        </NavLink>
      </div>
      
      {/* Hamburger menu button for mobile */}
      <button className="hamburger" onClick={toggleMobileMenu}>
        ☰
      </button>
      
      <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} ref={mobileMenuRef}>
        <li>
          <NavLink to="/" className="nav-item" end onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/updates" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            News
          </NavLink>
        </li>
        <li>
          <NavLink to="/map" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            Map
          </NavLink>
        </li>
        <li>
          <NavLink to="/report" className="nav-item emergency-btn" onClick={() => setIsMobileMenuOpen(false)}>
            Report
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
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
              <NavLink to="/signin" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
                Sign In
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className="nav-item register-btn" onClick={() => setIsMobileMenuOpen(false)}>
                Register
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

// Rest of your components remain the same...
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
          <button className="btn emergency" onClick={() => navigate('/report')}>
            Report Emergency {/* Add this button */}
          </button>
        </div>
      </div>
      <div className="hero-image">
        <img src={background} alt="Background" />
      </div>
    </div>
  );
}

export function Updates() {
  return <h2 style={{ padding: '2rem' }}>Latest Updates</h2>;
}

export function Map() {
  return <MapPage />;
}

export function Contact() {
  return <ContactPage />;
}