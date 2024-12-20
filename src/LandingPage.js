import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import Navbar from './Navbar'; // Importing Navbar component
import Footer from './Footer'; // Importing Footer component
import './LandingPage.css';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // Track modal type ('signUp' or 'logIn')
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

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
    signOut(auth)
      .then(() => {
        alert("You have logged out successfully.");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const handleNavigateToRideHistory = () => {
    navigate('/ride-history');
  };

  return (
    <div className="landing-container">
      <Navbar
        user={user}
        handleLogout={handleLogout}
        handleNavigateToRideHistory={handleNavigateToRideHistory}
        openSignUpModal={openSignUpModal}
        openLoginModal={openLoginModal}
      />
      {/* Main Content */}
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
      <Footer />
      {/* Conditional Rendering of Sign Up or Login Modal */}
      {isModalOpen && modalType === 'signUp' && <SignUpForm toggleModal={toggleModal} />}
      {isModalOpen && modalType === 'logIn' && <LoginForm toggleModal={toggleModal} />}
    </div>
  );
};

export default LandingPage;
