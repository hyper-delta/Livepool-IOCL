// LoginForm.js
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import './LoginForm.css';

const LoginForm = ({ toggleModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    // Firebase Authentication for logging in
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert('Login successful!');
        toggleModal();
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        alert("Login failed! " + error.message);
      });
  };

  return (
    <div className="modal-background" onClick={toggleModal}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Log In</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="cta-button submit-button">Log In</button>
        </form>
        <button className="close-button" onClick={toggleModal}>X</button>
      </div>
    </div>
  );
};

export default LoginForm;
