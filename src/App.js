import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import MapPage from './pages/MapPage';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Map Application</h1>
        </header>
        <main>
          <MapPage />
        </main>
      </div>
    </Router>
  );
}

export default App;