import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './pages/AuthContext';
import { Navbar, Home, Updates, Contact } from './pages/Home'; // Remove Map from here
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import ReportPage from './pages/ReportPage';
import MapPage from './pages/MapPage'; // Import the new MapPage component
import Profile from './pages/Profile'; 
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/map" element={<MapPage />} /> {/* Use MapPage here */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;