import React from 'react';
import './ImageSection.css';
import carImage from './Images/hero image-Photoroom.png';

const CarImageComponent = () => {
    return (
        <div className="image-section">
          <img src={carImage} alt="Car" className="car-image" />
        </div>
      );
};

export default CarImageComponent;
