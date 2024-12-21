import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import './Navbar.css'; // Ensure the CSS file contains Navbar styles
import Swal from 'sweetalert2';

const Navbar = ({
  openSignUpModal,
  openLoginModal,
}) => {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have logged out successfully.',
          confirmButtonText: 'OK',
        });
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error logging out: ${error.message}`,
          confirmButtonText: 'Try Again',
        });
      });
  };

  const handleNavigateToRideHistory = () => {
    navigate('/ride-history');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Make the LivePool brand clickable */}
        <Link to="/" className="brand-link">
          LivePool
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/host" className="nav-link">
          Host a Ride
        </Link>
        <Link to="/join" className="nav-link">
          Join a Ride
        </Link>
        {user ? (
          <>
            <span
              className="clickable user-name"
              onClick={handleNavigateToRideHistory}
            >
              {user.displayName || user.email}
            </span>
            <button
              className="cta-button logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="cta-button login-button"
              onClick={openLoginModal}
            >
              Log In
            </button>
            <button
              className="cta-button signup-button"
              onClick={openSignUpModal}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
