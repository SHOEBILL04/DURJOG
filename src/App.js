 partha-dev

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Home, Updates, Map, Contact } from './pages/Home'; 
import './pages/Home.css';


import SignIn from './pages/SignIn';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/map" element={<Map />} />
          <Route path="/contact" element={<Contact />} />
          
        </Routes>
      </div>
    </Router>

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './pages/AuthContext';
import { Navbar, Home, Updates, Map, Contact } from './pages/Home';
import Register from './pages/Register';
import SignIn from './pages/SignIn';
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
            <Route path="/map" element={<Map />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider> main
  );
}

export default App;