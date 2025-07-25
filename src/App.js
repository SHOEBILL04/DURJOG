import './App.css';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">Durjog</div>
        <ul className="nav-links">
          <li>Home</li>
          <li>News</li>
          <li>Map</li>
          <li>Contact</li>
          <li><button className="btn">Sign In</button></li>
          <li><button className="btn primary">Register</button></li>
        </ul>
      </nav>

      <div className="hero">
        <div className="hero-text">
          <h1>
            Together, We’re Stronger <br />
            <span>Durjog</span>
          </h1>
          <p>
            Durjog is built on the power of community and collaboration. In times of need,
            our platform allows you to quickly report emergencies, receive critical updates
            and access lifesaving information.
          </p>
          <div className="buttons">
            <button className="btn primary">Latest Updates</button>
            <button className="btn">Disaster Map</button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://i.imgur.com/2nCt3Sb.png" alt="Flood rescue" />
        </div>
      </div>
    </div>
  );
}

export default App;
