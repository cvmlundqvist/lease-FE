import React, { useState } from 'react';
import { Card, Modal } from 'react-bootstrap';
import { FaRoad, FaBolt } from 'react-icons/fa';
import './CarCard.css';

const CarCard = ({ car }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  let mileagePerMonth;
  if (car.mileagePerYear === "OBEGR") {
    mileagePerMonth = "Obegränsade";
  } else {
    const yearMileage = Number(car.mileagePerYear);
    mileagePerMonth = !isNaN(yearMileage) ? (yearMileage / 12).toFixed(1) : car.mileagePerYear;
  }

  // Bestäm bakgrundsfärg baserat på drivlina
  const getPowertrainColor = () => {
    if (car.powertrain.toLowerCase() === "el") {
      return "#95edac"; 
    } else if (car.powertrain.toLowerCase() === "bensin") {
      return "#D2B48C"; 
    }
    return "#d3d3d3";
  };

  return (
    <>
      <Card 
        className="mb-4 modern-card" 
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="supplier-flag">
          {car.supplier}
        </div>
        <div className="powertrain-flag" style={{ backgroundColor: getPowertrainColor() }}>
          {car.powertrain}
        </div>
        <Card.Img 
          variant="top" 
          src={car.imageUrl} 
          alt={`${car.brand} ${car.model}`} 
          style={{ height: '200px', objectFit: 'scale-down' }} 
        />
        <Card.Body>
          <Card.Title className="h2">{car.brand} {car.model}</Card.Title>
          <Card.Text>
           <b>Totalpris: {car.totalPrice} kr</b> <br/>
            Bindningstid: {car.contractMonths} månader<br />
            {car.electricRange ? <span>Räckvidd: {car.electricRange} km</span> : ''}<br />
            Växellåda: {car.transmission}<br />
            Biltyp: {car.carType}<br />
            {mileagePerMonth} mil per månad <br />
          </Card.Text>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{car.brand} {car.model}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img 
            src={car.imageUrl} 
            alt={`${car.brand} ${car.model}`} 
            style={{ width: '100%', height: 'auto', objectFit: 'cover', marginBottom: '1rem' }} 
          />
          <p><strong>Drivlina:</strong> {car.powertrain}</p>
          <p><strong>Växellåda:</strong> {car.transmission}</p>
          <p><strong>Biltyp:</strong> {car.carType}</p>
          <p><strong>Bindningstid:</strong> {car.contractMonths} mån</p>
          <p><strong>Mil/månad:</strong> {mileagePerMonth}</p>
          {car.electricRange && <p><strong>Räckvidd el:</strong> {car.electricRange} km</p>}
          <p><strong>Totalpris:</strong> {car.totalPrice} kr</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CarCard;
