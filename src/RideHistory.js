import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import './RideHistory.css';

const RideHistory = () => {
  const [hostedRides, setHostedRides] = useState([]);
  const [joinedRides, setJoinedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const database = getDatabase();

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      // Fetch hosted rides
      const hostedRidesRef = ref(database, `users/${user.uid}/hostedRides`);
      onValue(hostedRidesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const ridesList = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setHostedRides(ridesList);
        } else {
          setHostedRides([]);
        }
        setLoading(false);
      });

      // Fetch joined rides
      const joinedRidesRef = ref(database, `users/${user.uid}/joinedRides`);
      onValue(joinedRidesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const ridesList = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setJoinedRides(ridesList);
        } else {
          setJoinedRides([]);
        }
      });
    }
  }, [auth, database]);

  return (
    <div className="ride-history-container">
      <h2>Your Ride History</h2>

      {/* Hosted Rides Section */}
      <div className="hosted-rides-section">
        <h3 className="section-header">
          <span className="section-icon">🚗</span> Hosted Rides
        </h3>
        {loading ? (
          <p>Loading...</p>
        ) : hostedRides.length > 0 ? (
          <ul className="ride-list">
            {hostedRides.map((ride) => (
              <li key={ride.id} className="ride-item hosted-ride">
                <h4>{ride.carCompany} - {ride.carModel}</h4>
                <p><strong>Pickup Location:</strong> {ride.pickupLocation}</p>
                <p><strong>Destination:</strong> {ride.destination}</p>
                <p><strong>Date/Time:</strong> {ride.dateTime}</p>
                <p><strong>Seats Available:</strong> {ride.seatsAvailable}</p>
                <p><strong>Number Plate:</strong> {ride.numberPlate}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No rides hosted yet.</p>
        )}
      </div>

      {/* Joined Rides Section */}
      <div className="joined-rides-section">
        <h3 className="section-header">
          <span className="section-icon">🤝</span> Joined Rides
        </h3>
        {loading ? (
          <p>Loading...</p>
        ) : joinedRides.length > 0 ? (
          <ul className="ride-list">
            {joinedRides.map((ride) => (
              <li key={ride.id} className="ride-item joined-ride">
                <h4>{ride.carCompany} - {ride.carModel}</h4>
                <p><strong>Pickup Location:</strong> {ride.pickupLocation}</p>
                <p><strong>Destination:</strong> {ride.destination}</p>
                <p><strong>Date/Time:</strong> {ride.dateTime}</p>
                <p><strong>Host Name:</strong> {ride.hostName}</p>
                <p><strong>Host Phone:</strong> {ride.hostPhone}</p>
                <p><strong>Number Plate:</strong> {ride.numberPlate}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No rides joined yet.</p>
        )}
      </div>
    </div>
  );
};

export default RideHistory;
