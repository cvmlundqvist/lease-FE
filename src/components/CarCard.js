import React, { useState } from 'react';
import { Card, Modal, Button } from 'react-bootstrap';
import './CarCard.css';

const CarCard = ({ car }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);


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
      return "#95edac";
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
        {car.fourWheelDrive && (
          <div className="four-wheel-flag">
            4x4
          </div>
        )}
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
            Växellåda: {car.powertrain}<br />
            Biltyp: {car.carType}<br />
            {car.mileagePerMonths && <span>{car.mileagePerMonths} mil per månad<br /></span> }
            {car.electricRange && car.electricRange !== 0 && <span>Räckvidd: {car.electricRange} km<br /></span>}
          </Card.Text>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{car.brand} {car.model}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '50px' }}>
          <img 
            src={car.imageUrl || '/audi2.jpg'} 
            alt={`${car.brand} ${car.model}`} 
            style={{ width: '100%', height: 'auto', objectFit: 'cover', marginBottom: '1rem' }} 
          />
          {car.modelDescription && <p>{car.modelDescription}</p>}
          {car.fuelCategory && <p><strong>Drivlina:</strong> {car.fuelCategory}</p>}
          {car.powertrain && <p><strong>Växellåda:</strong> {car.powertrain}</p>}
          {car.carType && <p><strong>Biltyp:</strong> {car.carType}</p>}
          {car.contractMonths && <p><strong>Bindningstid:</strong> {car.contractMonths} mån</p>}
          {car.mileagePerMonths && <p><strong>{car.mileagePerMonths}</strong> inkluderade mil per månad </p>}
          {car.electricRange && <p><strong>Räckvidd el:</strong> {car.electricRange} km</p>}
          {car.fuel && <p><strong>Bränsle:</strong> {car.fuel}</p>}
          {car.fuelCategory && <p><strong>Bränslekategori:</strong> {car.fuelCategory}</p>}
          {car.fourWheelDrive !== undefined && (
            <p><strong>Fyrhjulsdrift:</strong> {car.fourWheelDrive ? 'Ja' : 'Nej'}</p>
          )}
          <p><strong>Totalpris:</strong> {car.totalPrice} kr</p>
          <div className="d-flex justify-content-center">
            <Button as="a" href={car.productUrl} target="_blank">
              Läs mer och boka på {car.supplier}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CarCard;
