import React, { useState } from 'react';
import { Container, Form, FormControl } from 'react-bootstrap';
import './HeroSection.css';

const HeroSection = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (onSearch) {
      onSearch(newQuery);
    }
  };

  return (
    <div
      className="hero-section"
      style={{
        background: "url('/audi.webp') center center/cover no-repeat",
        position: 'relative',
        height: '45vh',
      }}
    >
      {/* Logo in the top left corner */}
      <img src="/5.png" alt="Logo" className="hero-logo" />
      
      <Container className="text-center text-white" style={{ position: 'relative', zIndex: 2 }}>
        <h1 className="display-4 fw-bold">Hitta din drömbil</h1>
        <p className="lead">Enkelt. Smidigt. Moderna leasinglösningar.</p>
        <Form className="d-flex justify-content-center mt-4">
          <FormControl
            type="search"
            placeholder="Sök efter märke eller modell"
            className="me-2 search-input"
            aria-label="Sök"
            value={query}
            onChange={handleChange}
          />
        </Form>
      </Container>
      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default HeroSection;
