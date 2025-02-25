import React, { useState } from 'react';
import { Card, Modal, Button, Row, Col } from 'react-bootstrap';
import './CarCard.css';
import EuropcarAccordion from './EuropcarAccordion';

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

      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body style={{ padding: '50px' }}>
        <img 
  src={car.imageUrl || '/audi2.jpg'} 
  alt={`${car.brand} ${car.model}`} 
  style={{ 
    width: '90%', 
    height: 'auto', 
    objectFit: 'scale-down', 
    marginBottom: '1rem', 
    display: 'block', 
    marginLeft: 'auto', 
    marginRight: 'auto'
          }} 
          />
          <h2>{car.brand} {car.model}</h2>
          
          {car.modelDescription && <p>{car.modelDescription}</p>}
          
          <div className="attributes">
            <Row>
              {car.fuelCategory && (
                <Col md={6}>
                  <p><strong>Drivlina:</strong> {car.fuelCategory}</p>
                </Col>
              )}
              {car.powertrain && (
                <Col md={6}>
                  <p><strong>Växellåda:</strong> {car.powertrain}</p>
                </Col>
              )}
            </Row>
            <Row>
              {car.carType && (
                <Col md={6}>
                  <p><strong>Biltyp:</strong> {car.carType}</p>
                </Col>
              )}
              {car.contractMonths && (
                <Col md={6}>
                  <p><strong>Bindningstid:</strong> {car.contractMonths} mån</p>
                </Col>
              )}
            </Row>
            <Row>
              {car.mileagePerMonths && (
                <Col md={6}>
                  <p><strong>Mil per månad:</strong> {car.mileagePerMonths} mil</p>
                </Col>
              )}

              <Col md={6}>
                <p><strong>Pris per månad:</strong> {car.totalPrice} kr</p>
              </Col>
 
            </Row>
            <Row>
              {car.fourWheelDrive !== undefined && (
                <Col md={6}>
                  <p><strong>Fyrhjulsdrift:</strong> {car.fourWheelDrive ? 'Ja' : 'Nej'}</p>
                </Col>
              )}             
              {car.electricRange && (
                <Col md={6}>
                  <p><strong>Räckvidd el:</strong> {car.electricRange} km</p>
                </Col>
              )}


            </Row>
          </div>
          <EuropcarAccordion/>
          <div className="d-flex justify-content-center">
            <Button as="a" href={car.productUrl} target="_blank">
              Läs mer och boka på {car.supplier}
            </Button>
      
          </div>
          <br/>

        </Modal.Body>
      </Modal>
    </>
  );
};

export default CarCard;
