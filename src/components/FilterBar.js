import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import './FilterBar.css';

const FilterBar = ({
  onFilterChange,
  totalPriceRange = { min: 0, max: 50000 },
  brands = [],
  suppliers = [],
  powertrains = [],
  transmissions = [],
  carTypes = []
}) => {
  const defaultFilters = {
    brand: '',
    supplier: '',
    powertrain: '',
    transmission: '',
    carType: '',
    bindingTime: 36,
    totalPrice: { min: totalPriceRange.min, max: totalPriceRange.max },
    minMileage: 0,
  };

  // Vi sätter totalPrice som ett objekt med fast min-värde
  const [filters, setFilters] = useState(defaultFilters);

  // Uppdatera filter live
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleChange = (field, value) => {
    setFilters(prev => {
      if (field === 'totalPrice') {
        return { ...prev, totalPrice: value };
      }
      return { ...prev, [field]: value };
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <div className="filter-bar-wrapper my-4">
      <div className="filter-bar card shadow-sm p-4">
        <Row className="gy-3 align-items-end">
          <Col md={2}>
            <Form.Group controlId="brand">
              <Form.Label>Märke</Form.Label>
              <Form.Control 
                as="select" 
                value={filters.brand} 
                onChange={(e) => handleChange('brand', e.target.value)}
              >
                <option value="">Alla</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="supplier">
              <Form.Label>Leverantör</Form.Label>
              <Form.Control 
                as="select" 
                value={filters.supplier} 
                onChange={(e) => handleChange('supplier', e.target.value)}
              >
                <option value="">Alla</option>
                {suppliers.map((supplier) => (
                  <option key={supplier} value={supplier}>{supplier}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="powertrain">
              <Form.Label>Drivlina</Form.Label>
              <Form.Control 
                as="select" 
                value={filters.powertrain} 
                onChange={(e) => handleChange('powertrain', e.target.value)}
              >
                <option value="">Alla</option>
                {powertrains.map((pt) => (
                  <option key={pt} value={pt}>{pt}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="transmission">
              <Form.Label>Växellåda</Form.Label>
              <Form.Control 
                as="select" 
                value={filters.transmission} 
                onChange={(e) => handleChange('transmission', e.target.value)}
              >
                <option value="">Alla</option>
                {transmissions.map((trans) => (
                  <option key={trans} value={trans}>{trans}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="carType">
              <Form.Label>Biltyp</Form.Label>
              <Form.Control 
                as="select" 
                value={filters.carType} 
                onChange={(e) => handleChange('carType', e.target.value)}
              >
                <option value="">Alla</option>
                {carTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="bindingTime">
              <Form.Label>Bindningstid</Form.Label>
              <Form.Range 
                min="0" 
                max="36" 
                step="1" 
                value={filters.bindingTime} 
                onChange={(e) => handleChange('bindingTime', Number(e.target.value))}
              />
              <div className="small">{filters.bindingTime} mån</div>
            </Form.Group>
          </Col>
        </Row>
        <Row className="gy-3 align-items-end mt-3">
          <Col md={4}>
            <Form.Group controlId="totalPrice">
              <Form.Label>Totalpris (kr)</Form.Label>
              <div className="mb-2">
                <Form.Range 
                  min={totalPriceRange.min} 
                  max={totalPriceRange.max} 
                  step="500" 
                  value={filters.totalPrice.max}
                  onChange={(e) =>
                    handleChange('totalPrice', { ...filters.totalPrice, max: Number(e.target.value) })
                  }
                  style={{ backgroundColor: '#fff' }}
                />
              </div>
              <div className="small mt-1">
                {filters.totalPrice.max} kr
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="minMileage">
              <Form.Label>Mil/månad (minsta)</Form.Label>
              <Form.Range 
                min="0" 
                max="100" 
                step="1" 
                value={filters.minMileage}
                onChange={(e) => handleChange('minMileage', Number(e.target.value))}
                style={{ backgroundColor: '#fff' }}
              />
              <div className="small mt-1">
                {filters.minMileage} mil/månad+
              </div>
            </Form.Group>
          </Col>
          {/* Lägg till en kolumn för "Nollställ filter"-knappen */}
          <Col md={4} className="text-md-end">
            <Button variant="dark" onClick={resetFilters}>
              Nollställ filter
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default FilterBar;
