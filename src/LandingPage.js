// LandingPage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import './LandingPage.css';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import logo from './Images/IOCL-logo.png';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // Track modal type ('signUp' or 'logIn')
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, [auth]);

  const openSignUpModal = () => {
    setModalType('signUp');
    setIsModalOpen(true);
  };

  const openLoginModal = () => {
    setModalType('logIn');
    setIsModalOpen(true);
  };

  const toggleModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      alert("You have logged out successfully.");
    }).catch((error) => {
      console.error("Error logging out:", error);
    });
  };

  return (
    <div className="landing-container">
      <header className="header">
        <img 
          src={logo} 
          alt="Indian Oil Corporation Limited" 
          className="company-logo" 
        />
        <div className="auth-buttons">
          {user ? (
            <div className="user-dropdown">
              <span className="user-name">{user.displayName || user.email}</span>
              <button className="cta-button logout-button" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <button className="cta-button login-button" onClick={openLoginModal}>Log In</button>
              <button className="cta-button signup-button" onClick={openSignUpModal}>Sign Up</button>
            </>
          )}
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

      {/* Conditional Rendering of Sign Up or Login Modal */}
      {isModalOpen && modalType === 'signUp' && <SignUpForm toggleModal={toggleModal} />}
      {isModalOpen && modalType === 'logIn' && <LoginForm toggleModal={toggleModal} />}
    </div>
  );
};

export default LandingPage;
