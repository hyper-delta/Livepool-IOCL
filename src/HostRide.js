import React, { useState, useEffect } from 'react';
import './HostRide.css';
import { ref, set, push, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import database from './firebase';

const HostRide = () => {
  const [rideDetails, setRideDetails] = useState({
    pickupLocation: '',
    destination: '',
    seatsAvailable: '',
    dateTime: '',
    carCompany: '',
    carModel: '',
    numberPlate: '',
  });

  const [userData, setUserData] = useState(null); // To store logged-in user's details

  const auth = getAuth();

  // Fetch user details on component mount
  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userRef = ref(database, 'users/' + user.uid);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            console.warn("No user data found");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRideDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userData) {
      alert('User data not found. Please log in again.');
      return;
    }

    const { employeeIdCard, fullName, email } = userData;

    if (!employeeIdCard) {
      alert('ID Card information is missing. Please complete your profile.');
      return;
    }

    const userId = auth.currentUser.uid;

    // Save the ride details under the user's hosted rides
    const userRidesRef = ref(database, `users/${userId}/hostedRides`);
    const newRideRef = push(userRidesRef); // Generate a unique key for the new ride

    const rideData = {
      ...rideDetails,
      hostId: userId,
      hostName: fullName || 'Unknown', // Fallback for missing data
      hostEmail: email || 'Unknown',
      hostIdCard: employeeIdCard || 'Unavailable', // Fallback for missing ID card
      timestamp: Date.now(),
    };

    set(newRideRef, rideData)
      .then(() => {
        alert('Ride successfully published!');
        // Clear the form after successful submission
        setRideDetails({
          pickupLocation: '',
          destination: '',
          seatsAvailable: '',
          dateTime: '',
          carCompany: '',
          carModel: '',
          numberPlate: '',
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
        <div className="form-group">
          <label>Date and Time:</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={rideDetails.dateTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Car Company:</label>
          <input
            type="text"
            name="carCompany"
            value={rideDetails.carCompany}
            onChange={handleChange}
            placeholder="E.g., Toyota, Honda"
            required
          />
        </div>
        <div className="form-group">
          <label>Car Model:</label>
          <input
            type="text"
            name="carModel"
            value={rideDetails.carModel}
            onChange={handleChange}
            placeholder="E.g., Corolla, Civic"
            required
          />
        </div>
        <div className="form-group">
          <label>Number Plate:</label>
          <input
            type="text"
            name="numberPlate"
            value={rideDetails.numberPlate}
            onChange={handleChange}
            placeholder="E.g., ABC-1234"
            required
          />
        </div>
        <button type="submit" className="cta-button submit-button">
          Publish Ride
        </button>
      </form>
    </div>
  );
};

export default HostRide;
