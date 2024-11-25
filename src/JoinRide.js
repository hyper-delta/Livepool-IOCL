import React, { useEffect, useState } from 'react';
import { ref, onValue, update } from "firebase/database";
import database from './firebase';
import './JoinRide.css';

const JoinRide = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const usersRef = ref(database, 'users/');
    
    // Fetch all rides under each user's hostedRides node
    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      const allRides = [];

      if (usersData) {
        Object.keys(usersData).forEach(userId => {
          if (usersData[userId].hostedRides) {
            const userRides = usersData[userId].hostedRides;
            Object.keys(userRides).forEach(rideId => {
              allRides.push({ 
                id: rideId, 
                ...userRides[rideId], 
                hostId: userId, 
                hostName: usersData[userId].fullName || 'Unknown', 
                hostEmail: usersData[userId].email || 'Unknown',
                hostIdCard: usersData[userId].employeeIdCard || null, // Fetch employee ID Card
              });
            });
          }
        });
      }

      setRides(allRides);
    });
  }, []);

  const handleJoinRide = (hostId, rideId, seatsAvailable) => {
    if (seatsAvailable > 0) {
      // Decrement seat count in Firebase
      const rideRef = ref(database, `users/${hostId}/hostedRides/${rideId}`);
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
              <p><strong>Host Name:</strong> {ride.hostName}</p>
              <p><strong>Host Email:</strong> {ride.hostEmail}</p>
              {ride.hostIdCard && (
                <div className="id-card-container">
                  <h4>Host ID Card:</h4>
                  <img
                    src={ride.hostIdCard}
                    alt={`${ride.hostName}'s ID Card`}
                    className="id-card-image"
                  />
                </div>
              )}
              <button 
                className="cta-button join-button"
                onClick={() => handleJoinRide(ride.hostId, ride.id, ride.seatsAvailable)}
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
