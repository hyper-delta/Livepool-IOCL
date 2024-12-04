import React, { useEffect, useState } from 'react';
import { ref, onValue, update } from "firebase/database";
import database from './firebase';
import './JoinRide.css';

const JoinRide = () => {
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [filterDate, setFilterDate] = useState(''); // State for selected date filter

  useEffect(() => {
    const usersRef = ref(database, 'users/');
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
                hostIdCard: usersData[userId].employeeIdCard || null,
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
      const rideRef = ref(database, `users/${hostId}/hostedRides/${rideId}`);
      update(rideRef, { seatsAvailable: seatsAvailable - 1 })
        .then(() => alert('You have successfully joined the ride!'))
        .catch((error) => console.error('Error updating seat count:', error));
    } else {
      alert('No seats available!');
    }
  };

  const openModal = (ride) => {
    setSelectedRide(ride);
  };

  const closeModal = () => {
    setSelectedRide(null);
  };

  const handleFilterChange = (event) => {
    setFilterDate(event.target.value);
  };

  // Filter the rides based on the selected date
  const filteredRides = rides.filter(ride => {
    if (filterDate) {
      const rideDate = new Date(ride.dateTime);
      const selectedDate = new Date(filterDate);
      // Only show rides that match the selected date
      return rideDate.toDateString() === selectedDate.toDateString();
    }
    return true; // Show all rides if no date is selected
  });

  return (
    <div className="join-ride-container">
      <h2>Available Rides</h2>

      {/* Date Filter */}
      <div className="date-filter">
        <input 
          type="date" 
          value={filterDate} 
          onChange={handleFilterChange} 
          className="date-input"
          placeholder="Select Date"
        />
      </div>

      {filteredRides.length === 0 ? (
        <p className="no-rides-message">No rides available at the moment.</p>
      ) : (
        <div className="rides-grid">
          {filteredRides.map((ride) => (
            <div 
              key={ride.id} 
              className="ride-card" 
              onClick={() => openModal(ride)}
            >
              <p><strong>Pickup Location:</strong> {ride.pickupLocation}</p>
              <p><strong>Destination:</strong> {ride.destination}</p>
              <p><strong>Host Name:</strong> {ride.hostName}</p>
            </div>
          ))}
        </div>
      )}

      {selectedRide && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Ride Details</h3>
            <p><strong>Pickup Location:</strong> {selectedRide.pickupLocation}</p>
            <p><strong>Destination:</strong> {selectedRide.destination}</p>
            <p><strong>Seats Available:</strong> {selectedRide.seatsAvailable}</p>
            <p><strong>Host Name:</strong> {selectedRide.hostName}</p>
            {selectedRide.dateTime && (
              <p><strong>Date and Time:</strong> {new Date(selectedRide.dateTime).toLocaleString()}</p>
            )}
            {selectedRide.carCompany && (
              <p><strong>Car:</strong> {selectedRide.carCompany} {selectedRide.carModel}</p>
            )}
            {selectedRide.numberPlate && (
              <p><strong>Number Plate:</strong> {selectedRide.numberPlate}</p>
            )}
            {selectedRide.hostIdCard && (
              <div className="id-card-container">
                <h4>Host ID Card:</h4>
                <img
                  src={selectedRide.hostIdCard}
                  alt={`${selectedRide.hostName}'s ID Card`}
                  className="id-card-image"
                />
              </div>
            )}
            <button 
              className="cta-button join-button"
              onClick={() => handleJoinRide(selectedRide.hostId, selectedRide.id, selectedRide.seatsAvailable)}
              disabled={selectedRide.seatsAvailable === 0}
            >
              {selectedRide.seatsAvailable > 0 ? 'Join Ride' : 'No Seats Available'}
            </button>
            <button className="cta-button close-button" onClick={closeModal}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinRide;
