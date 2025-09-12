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
          <span className="logo-text">Durjog</span>
        </NavLink>
      </div>
      
      {/* Hamburger menu button for mobile */}
      <button className="hamburger" onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
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

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Together, We're <span className="accent-text">Stronger</span>
            </h1>
            <p className="hero-description">
              Durjog is built on the power of community and collaboration. In times of need,
              our platform allows you to quickly report emergencies, receive critical updates,
              and access lifesaving information.
            </p>
            <div className="hero-buttons">
              <button className="btn primary" onClick={() => navigate('/updates')}>
                Latest Updates
              </button>
              <button className="btn secondary" onClick={() => navigate('/map')}>
                Disaster Map
              </button>
              <button className="btn emergency" onClick={() => navigate('/report')}>
                Report Emergency
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img src={background} alt="Community helping each other" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>How Durjog Helps Communities</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📢</div>
              <h3>Real-time Alerts</h3>
              <p>Receive immediate notifications about emergencies in your area.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Interactive Map</h3>
              <p>Visualize disaster areas and resources with our live map.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Community Support</h3>
              <p>Connect with others to provide and receive assistance during crises.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat">
              <h3>10,000+</h3>
              <p>Lives Impacted</p>
            </div>
            <div className="stat">
              <h3>500+</h3>
              <p>Emergency Reports</p>
            </div>
            <div className="stat">
              <h3>50+</h3>
              <p>Communities Served</p>
            </div>
            <div className="stat">
              <h3>24/7</h3>
              <p>Active Monitoring</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <img src={logo} alt="Durjog" className="logo-img" />
            <h3>Durjog</h3>
          </div>
          <p>Building resilient communities through technology and collaboration.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><span>📱</span></a>
            <a href="#" aria-label="Twitter"><span>🐦</span></a>
            <a href="#" aria-label="Instagram"><span>📸</span></a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/updates">News</NavLink></li>
            <li><NavLink to="/map">Map</NavLink></li>
            <li><NavLink to="/report">Report Emergency</NavLink></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Emergency Guidelines</a></li>
            <li><a href="#">Preparedness Tips</a></li>
            <li><a href="#">Community Resources</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul className="contact-info">
            <li>📧 info@durjog.org</li>
            <li>📞 +1 (555) 123-4567</li>
            <li>📍 123 Safety Avenue, Secure City</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Durjog. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
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