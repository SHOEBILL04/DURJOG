
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
  );
}

export default App;
