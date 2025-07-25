import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Durjog</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/updates">News</Link></li>
        <li><Link to="/map">Map</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/signin"><button className="btn">Sign In</button></Link></li>
        <li><Link to="/register"><button className="btn primary">Register</button></Link></li>
      </ul>
    </nav>
  );
}

function Home() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="hero-text">
        <h1>
          Together, We’re Stronger <br />
          <span>Durjog</span>
        </h1>
        <p>
          Durjog is built on the power of community and collaboration. In times of need,
          our platform allows you to quickly report emergencies, receive critical updates,
          and access lifesaving information.
        </p>
        <div className="buttons">
          <button className="btn primary" onClick={() => navigate('/updates')}>Latest Updates</button>
          <button className="btn" onClick={() => navigate('/map')}>Disaster Map</button>
        </div>
      </div>
      <div className="hero-image">
        <img src="https://i.imgur.com/2nCt3Sb.png" alt="Flood rescue" />
      </div>
    </div>
  );
}

// Simple placeholders for other pages
function SignIn() {
  return <h2 style={{ padding: '2rem' }}>Sign In Page</h2>;
}
function Register() {
  return <h2 style={{ padding: '2rem' }}>Register Page</h2>;
}
function Updates() {
  return <h2 style={{ padding: '2rem' }}>Latest Updates</h2>;
}
function Map() {
  return <h2 style={{ padding: '2rem' }}>Disaster Map</h2>;
}
function Contact() {
  return <h2 style={{ padding: '2rem' }}>Contact Page</h2>;
}

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
  );
}

export default App;
