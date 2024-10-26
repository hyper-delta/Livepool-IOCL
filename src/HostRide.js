import React, { useState } from 'react';
import './HostRide.css';
import { ref, set } from "firebase/database";
import database from './firebase'; // Import the initialized Firebase instance

const HostRide = () => {
  const [rideDetails, setRideDetails] = useState({
    pickupLocation: '',
    destination: '',
    seatsAvailable: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRideDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate a unique ID for each ride
    const rideId = Date.now();

    // Save the ride details to Firebase
    set(ref(database, 'rides/' + rideId), {
      pickupLocation: rideDetails.pickupLocation,
      destination: rideDetails.destination,
      seatsAvailable: rideDetails.seatsAvailable,
      timestamp: rideId // Saving timestamp to track the ride creation time
    })
    .then(() => {
      alert('Ride successfully published!');
      // Clear the form after successful submission
      setRideDetails({
        pickupLocation: '',
        destination: '',
        seatsAvailable: ''
      });
    })
    .catch((error) => {
      console.error('Error writing to Firebase Database:', error);
    });
  };

  return (
    <div className="host-ride-container">
      <h2>Host a Ride</h2>
      <form onSubmit={handleSubmit} className="ride-form">
        <div className="form-group">
          <label>Pickup Location:</label>
          <input 
            type="text" 
            name="pickupLocation" 
            value={rideDetails.pickupLocation}
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Destination:</label>
          <input 
            type="text" 
            name="destination" 
            value={rideDetails.destination}
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Seats Available:</label>
          <input 
            type="number" 
            name="seatsAvailable" 
            value={rideDetails.seatsAvailable}
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" className="cta-button submit-button">Publish Ride</button>
      </form>
    </div>
  );
};

export default HostRide;
