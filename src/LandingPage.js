import React from "react";
import { Link } from "react-router-dom";
import './LandingPage.css';
import logo from './Images/IOCL-logo.png'

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="header">
        <img 
          src={logo} 
          alt="Indian Oil Corporation Limited" 
          className="company-logo" 
        />
        <div className="auth-buttons">
          <button className="cta-button login-button">Log In</button>
          <button className="cta-button signup-button">Sign Up</button>
        </div>
      </header>

      <main className="main-content">
        <h2>Carpooling made easy!</h2>
        <p>Offer or join a ride with your colleagues at Indian Oil Corporation Limited.</p>
        <div className="cta-buttons">
          <Link to="/host">
            <button className="cta-button host-button">Host a Ride</button>
          </Link>
          <Link to="/join">
            <button className="cta-button join-button">Join a Ride</button>
          </Link>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Indian Oil Corporation Limited | Livepool</p>
      </footer>
    </div>
  );
};

export default LandingPage;
