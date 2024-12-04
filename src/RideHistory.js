import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import database from './firebase';

const RideHistory = ({ userId }) => {
  const [hostedRides, setHostedRides] = useState([]);
  const [joinedRides, setJoinedRides] = useState([]);

  useEffect(() => {
    // Fetch hosted rides for the logged-in user
    const hostedRidesRef = ref(database, `users/${userId}/hostedRides`);
    onValue(hostedRidesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setHostedRides(Object.values(data));
      } else {
        setHostedRides([]);
      }
    });

    // Fetch joined rides for the logged-in user
    const joinedRidesRef = ref(database, `users/${userId}/joinedRides`);
    onValue(joinedRidesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setJoinedRides(Object.values(data));
      } else {
        setJoinedRides([]);
      }
    });
  }, [userId]);

  return (
    <div className="ride-history-container">
      <h2>Your Ride History</h2>

      <div className="ride-history-section">
        <h3>Hosted Rides</h3>
        {hostedRides.length === 0 ? (
          <p>No rides hosted yet.</p>
        ) : (
          hostedRides.map((ride, index) => (
            <div key={index} className="ride-card">
              <p><strong>Pickup Location:</strong> {ride.pickupLocation}</p>
              <p><strong>Destination:</strong> {ride.destination}</p>
              <p><strong>Date and Time:</strong> {new Date(ride.dateTime).toLocaleString()}</p>
              <p><strong>Seats Available:</strong> {ride.seatsAvailable}</p>
            </div>
          ))
        )}
      </div>

      <div className="ride-history-section">
        <h3>Joined Rides</h3>
        {joinedRides.length === 0 ? (
          <p>No rides joined yet.</p>
        ) : (
          joinedRides.map((ride, index) => (
            <div key={index} className="ride-card">
              <p><strong>Pickup Location:</strong> {ride.pickupLocation}</p>
              <p><strong>Destination:</strong> {ride.destination}</p>
              <p><strong>Date and Time:</strong> {new Date(ride.dateTime).toLocaleString()}</p>
              <p><strong>Host Name:</strong> {ride.hostName}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RideHistory;
