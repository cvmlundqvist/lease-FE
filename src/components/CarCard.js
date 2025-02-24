import React, { useState } from 'react';
import { Card, Modal, Button } from 'react-bootstrap';
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

  const getFuelCategoryColor = () => {
    const category = car.fuelCategory?.toLowerCase();
    if (category === "laddhybryd" || category === "laddhybrid") {
      return "#a0bfa5";
    } else if (category === "diesel") {
      return "#a8997a";
    } else if (category === "elhybrid") {
      return "#b2c8b2";
    } else if (category === "bensin") {
      return "#d2a679";
    } else if (category === "el") {
      return "#95edac"
;
    }
    return "#d3d3d3"; // fallback-färg
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
        <div className="powertrain-flag" style={{ backgroundColor: getFuelCategoryColor() }}>
          {car.fuelCategory}
        </div>
        <Card.Img 
          variant="top" 
          src={car.imageUrl || 'logo-svart_text.png'}
          alt={`${car.brand} ${car.model}`} 
          style={{ height: '200px', objectFit: 'scale-down' }} 
        />
        <Card.Body>
          <Card.Title className="h2">{car.brand} {car.model}</Card.Title>
          <Card.Text>
          <b>Pris per månad: {car.totalPrice === 0 ? `${car.price} kr (företagspris)` : `${car.totalPrice} kr`}</b><br />
            Bindningstid: {car.contractMonths} mån<br />
            Växellåda: {car.transmission}<br />
            Biltyp: {car.carType}<br />
            {mileagePerMonth} mil per månad <br />
            {car.electricRange && <span>Räckvidd: {car.electricRange} km<br /></span>}
            {car.fuel && <span>Bränsle: {car.fuel}<br /></span>}
            {car.fuelCategory && <span>Bränslekategori: {car.fuelCategory}<br /></span>}
            {car.fourWheelDrive !== undefined && (
              <span>Fyrhjulsdrift: {car.fourWheelDrive ? 'Ja' : 'Nej'}</span>
            )}
          </Card.Text>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{car.brand} {car.model}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <img 
          src={car.imageUrl || '/audi2.jpg'} 
          alt={`${car.brand} ${car.model}`} 
          style={{ width: '100%', height: 'auto', objectFit: 'cover', marginBottom: '1rem' }} 
        />

          <p><strong>Drivlina:</strong> {car.powertrain}</p>
          <p><strong>Växellåda:</strong> {car.transmission}</p>
          <p><strong>Biltyp:</strong> {car.carType}</p>
          <p><strong>Bindningstid:</strong> {car.contractMonths} mån</p>
          <p><strong>Mil/månad:</strong> {mileagePerMonth}</p>
          {car.electricRange && <p><strong>Räckvidd el:</strong> {car.electricRange} km</p>}
          {car.fuel && <p><strong>Bränsle:</strong> {car.fuel}</p>}
          {car.fuelCategory && <p><strong>Bränslekategori:</strong> {car.fuelCategory}</p>}
          {car.fourWheelDrive !== undefined && (
            <p><strong>Fyrhjulsdrift:</strong> {car.fourWheelDrive ? 'Ja' : 'Nej'}</p>
          )}
          <p><strong>Totalpris:</strong> {car.totalPrice} kr</p>
          <Button as="a" href={car.productUrl} target="_blank">
           Läs mer och boka på {car.supplier}
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CarCard;
