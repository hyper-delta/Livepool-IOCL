import React, { useEffect, useState } from 'react';
import { ref, onValue, update } from "firebase/database";
import database from './firebase';
import './JoinRide.css';

const JoinRide = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const ridesRef = ref(database, 'rides/');
    onValue(ridesRef, (snapshot) => {
      const data = snapshot.val();
      const ridesList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setRides(ridesList);
    });
  }, []);

  const handleJoinRide = (rideId, seatsAvailable) => {
    if (seatsAvailable > 0) {
      // Decrement seat count in Firebase
      const rideRef = ref(database, `rides/${rideId}`);
      update(rideRef, {
        seatsAvailable: seatsAvailable - 1
      }).then(() => {
        alert('You have successfully joined the ride!');
      }).catch((error) => {
        console.error('Error updating seat count:', error);
      });
    } else {
      alert('No seats available!');
    }
  };

  return (
    <div className="join-ride-container">
      <h2>Available Rides</h2>
      {rides.length === 0 ? (
        <p className="no-rides-message">No rides available at the moment.</p>
      ) : (
        <div className="rides-grid">
          {rides.map((ride, index) => (
            <div key={ride.id} className="ride-card">
              <h3>Ride #{index + 1}</h3>
              <p><strong>Pickup Location:</strong> {ride.pickupLocation}</p>
              <p><strong>Destination:</strong> {ride.destination}</p>
              <p><strong>Seats Available:</strong> {ride.seatsAvailable}</p>
              <button 
                className="cta-button join-button"
                onClick={() => handleJoinRide(ride.id, ride.seatsAvailable)}
                disabled={ride.seatsAvailable === 0}
              >
                {ride.seatsAvailable > 0 ? 'Join Ride' : 'No Seats Available'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JoinRide;
