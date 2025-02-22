import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-5">
      <Container>
        <Row className="align-items-center">
          {/* Vänstra kolumn: Logo och varumärke */}
          <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
            <div className="footer-brand">
              <img src="/endast-logo.png" alt="Leasejakt Logo" className="footer-logo" />
              <div className="footer-brand-text-container">
                <div className="footer-brand-text">Leasejakt</div>
                <div className="footer-tagline">Jämförelsesajt för privatleasing</div>
              </div>
            </div>
          </Col>
          {/* Mittenkolumn: Copyright */}
          <Col md={4} className="text-center mb-3 mb-md-0">
            <small>&copy; {new Date().getFullYear()} Leasejakt. Alla rättigheter reserverade.</small>
          </Col>
          {/* Högra kolumn: Länkar */}
          <Col md={4} className="text-center text-md-end">
            <div className="footer-links">
              <a href="/faq" className="footer-link d-block">Vanliga frågor</a>
              <a href="/om-oss" className="footer-link d-block">Om oss</a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
