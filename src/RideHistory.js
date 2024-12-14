import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import './RideHistory.css';

const RideHistory = () => {
  const [hostedRides, setHostedRides] = useState([]);
  const [joinedRides, setJoinedRides] = useState([]); // State for joined rides
  const [loading, setLoading] = useState(true); // State to manage loading
  const auth = getAuth(); // Access Firebase Authentication
  const database = getDatabase();

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      // Fetch hosted rides for the logged-in user
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

      // Fetch joined rides for the logged-in user
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
      <h3>Hosted Rides</h3>
      {loading ? (
        <p>Loading...</p>
      ) : hostedRides.length > 0 ? (
        <ul className="ride-list">
          {hostedRides.map((ride) => (
            <li key={ride.id} className="ride-item">
              <h4 style={{ color: "#F37022", marginBottom: "10px" }}>{ride.carCompany} - {ride.carModel}</h4>
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

      {/* Joined Rides Section */}
      <h3>Joined Rides</h3>
      {loading ? (
        <p>Loading...</p>
      ) : joinedRides.length > 0 ? (
        <ul className="ride-list">
          {joinedRides.map((ride) => (
            <li key={ride.id} className="ride-item">
              <h4 style={{ color: "#02164F", marginBottom: "10px" }}>{ride.carCompany} - {ride.carModel}</h4>
              <p><strong>Pickup Location:</strong> {ride.pickupLocation}</p>
              <p><strong>Destination:</strong> {ride.destination}</p>
              <p><strong>Date/Time:</strong> {ride.dateTime}</p>
              <p><strong>Host Name:</strong> {ride.hostName}</p>
              <p><strong>Number Plate:</strong> {ride.numberPlate}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No rides joined yet.</p>
      )}
    </div>
  );
};

export default RideHistory;
