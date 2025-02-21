import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CarCard from './CarCard';
import Fuse from 'fuse.js';

// Helper function to normalize query strings (e.g., converting 'vw' to 'volkswagen')
const preprocessQuery = (query) => {
  let q = query.toLowerCase().trim();
  if (q === 'vw') {
    q = 'volkswagen';
  }
  return q;
};

const CarList = ({ filters }) => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all cars from the API
  useEffect(() => {
    api.get('/cars')
      .then(response => {
        setCars(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching cars:', err);
        setError('Kunde inte hämta bilar.');
        setLoading(false);
      });
  }, []);

  // Apply filters and then deduplicate
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...cars];

      // Fuzzy search with Fuse.js for searchQuery
      if (filters && filters.searchQuery) {
        const query = preprocessQuery(filters.searchQuery);
        const fuseOptions = {
          keys: ['brand', 'model'],
          threshold: 0.4, // Lower threshold = stricter matching
        };
        const fuse = new Fuse(filtered, fuseOptions);
        const fuseResults = fuse.search(query);
        filtered = fuseResults.map(result => result.item);
      }

      // Apply other filters
      if (filters) {
        if (filters.brand) {
          filtered = filtered.filter(car =>
            car.brand.toLowerCase().includes(filters.brand.toLowerCase())
          );
        }
        if (filters.supplier) {
          filtered = filtered.filter(car =>
            car.supplier.toLowerCase().includes(filters.supplier.toLowerCase())
          );
        }
        if (filters.powertrain) {
          filtered = filtered.filter(car => car.powertrain === filters.powertrain);
        }
        if (filters.transmission) {
          filtered = filtered.filter(car => car.transmission === filters.transmission);
        }
        if (filters.carType) {
          filtered = filtered.filter(car =>
            car.carType.toLowerCase().includes(filters.carType.toLowerCase())
          );
        }
        if (filters.bindingTime !== undefined) {
          filtered = filtered.filter(car => car.contractMonths <= filters.bindingTime);
        }
        if (filters.totalPrice) {
          filtered = filtered.filter(car =>
            car.totalPrice >= filters.totalPrice.min && car.totalPrice <= filters.totalPrice.max
          );
        }
        if (filters.minMileage !== undefined) {
          filtered = filtered.filter(car => {
            let monthlyMileage;
            if (car.mileagePerYear === "OBEGR") {
              monthlyMileage = Infinity;
            } else {
              const yearMileage = Number(car.mileagePerYear);
              monthlyMileage = isNaN(yearMileage) ? 0 : yearMileage / 12;
            }
            return monthlyMileage >= filters.minMileage;
          });
        }
      }

      // Deduplicate: group cars by brand, model, powertrain, and transmission.
      // For each group, only keep the car with the lowest totalPrice.
      const deduped = Object.values(
        filtered.reduce((acc, car) => {
          const key = `${car.brand}-${car.model}-${car.powertrain}-${car.transmission}`;
          if (!acc[key] || car.totalPrice < acc[key].totalPrice) {
            acc[key] = car;
          }
          return acc;
        }, {})
      );
      setFilteredCars(deduped);
    };

    applyFilters();
  }, [filters, cars]);

  if (loading) {
    return <div className="text-center mt-5">Laddar bilar...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  return (
    <div className="row">
      {filteredCars.length === 0 ? (
        <div className="col-12">
          <p className="text-center">Inga bilar hittades.</p>
        </div>
      ) : (
        filteredCars.map(car => (
          <div key={car.id} className="col-md-4 mb-4">
            <CarCard car={car} />
          </div>
        ))
      )}
    </div>
  );
};

export default CarList;
