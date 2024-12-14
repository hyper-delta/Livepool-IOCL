// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import LandingPage from './LandingPage';
import HostRide from './HostRide';
import JoinRide from './JoinRide';
import RideHistory from './RideHistory'; // Import the RideHistory component

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/host" element={<ProtectedRoute><HostRide /></ProtectedRoute>} />
        <Route path="/join" element={<ProtectedRoute><JoinRide /></ProtectedRoute>} />
        <Route path="/ride-history" element={<ProtectedRoute><RideHistory /></ProtectedRoute>} /> {/* New route for RideHistory */}
      </Routes>
    </Router>
  );
}

export default App;
