import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import HostRide from './HostRide';
import JoinRide from './JoinRide';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/host" element={<HostRide />} />
        <Route path="/join" element={<JoinRide />} />
      </Routes>
    </Router>
  );
}

export default App;
