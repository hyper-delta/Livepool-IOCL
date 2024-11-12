// SignUpForm.js
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import database from './firebase';
import './SignUpForm.css';

const SignUpForm = ({ toggleModal }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: ''
  });

  const auth = getAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const { fullName, phoneNumber, email, password } = formData;

    // Firebase Authentication for sign-up
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Update display name in Firebase Authentication
        updateProfile(user, { displayName: fullName }).then(() => {
          // Store additional user data in Firebase Database
          set(ref(database, 'users/' + user.uid), {
            fullName,
            phoneNumber,
            email
          });
          alert('Sign up successful!');
          toggleModal();
        }).catch(error => console.error("Error updating profile:", error));
      })
      .catch((error) => {
        console.error("Error signing up:", error);
        alert("Sign up failed! " + error.message);
      });
  };

  return (
    <div className="modal-background" onClick={toggleModal}>
      <div className="signup-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label>Full Name:</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email Address:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="cta-button submit-button">Sign Up</button>
        </form>
        <button className="close-button" onClick={toggleModal}>X</button>
      </div>
    </div>
  );
};

export default SignUpForm;
