import React, { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import api from '../services/api';
import CarCard from './CarCard';
import Fuse from 'fuse.js';

// Hjälpfunktion för att normalisera söksträngar
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

  // Cache för bilmodellsdata för att undvika upprepade API-anrop
  const carModelCache = useRef({});

  // Memoisera filters med JSON.stringify för att undvika onödiga re-renders
  const memoFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  // Hämta alla bilar från API:t
  useEffect(() => {
    let isMounted = true;
    api.get('/cars')
      .then(response => {
        if (isMounted) {
          setCars(response.data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Error fetching cars:', err);
        if (isMounted) {
          setError('Kunde inte hämta bilar.');
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  // Debounce filteruppdateringar för att undvika att useEffect körs för ofta
  const [debouncedFilters, setDebouncedFilters] = useState(memoFilters);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(memoFilters);
    }, 300);
    return () => clearTimeout(handler);
  }, [memoFilters]);

  // Applicera filter och "stitch" med bilmodellsdata
  useEffect(() => {
    const applyFiltersAndStitch = async () => {
      let filtered = [...cars];

      // Fuzzy search med Fuse.js
      if (debouncedFilters && debouncedFilters.searchQuery) {
        const query = preprocessQuery(debouncedFilters.searchQuery);
        const fuseOptions = {
          keys: ['brand', 'model'],
          threshold: 0.4,
        };
        const fuse = new Fuse(filtered, fuseOptions);
        const fuseResults = fuse.search(query);
        filtered = fuseResults.map(result => result.item);
      }

      // Övriga filter
      if (debouncedFilters) {
        if (debouncedFilters.brand) {
          filtered = filtered.filter(car =>
            car.brand.toLowerCase().includes(debouncedFilters.brand.toLowerCase())
          );
        }
        if (debouncedFilters.supplier) {
          filtered = filtered.filter(car =>
            car.supplier.toLowerCase().includes(debouncedFilters.supplier.toLowerCase())
          );
        }
        if (debouncedFilters.powertrain) {
          filtered = filtered.filter(car => car.powertrain === debouncedFilters.powertrain);
        }
        if (debouncedFilters.transmission) {
          filtered = filtered.filter(car => car.transmission === debouncedFilters.transmission);
        }
        if (debouncedFilters.carType) {
          filtered = filtered.filter(car =>
            car.carType.toLowerCase().includes(debouncedFilters.carType.toLowerCase())
          );
        }
        if (debouncedFilters.totalPrice) {
          filtered = filtered.filter(car =>
            car.totalPrice >= debouncedFilters.totalPrice.min &&
            car.totalPrice <= debouncedFilters.totalPrice.max
          );
        }
        if (debouncedFilters.minMileage !== undefined) {
          filtered = filtered.filter(car => {
            let monthlyMileage;
            if (car.mileagePerYear === "OBEGR") {
              monthlyMileage = Infinity;
            } else {
              const yearMileage = Number(car.mileagePerYear);
              monthlyMileage = isNaN(yearMileage) ? 0 : yearMileage / 12;
            }
            return monthlyMileage >= debouncedFilters.minMileage;
          });
        }
      }

      // Deduplicera: gruppera bilar efter brand, model, powertrain och transmission.
      const deduped = Object.values(
        filtered.reduce((acc, car) => {
          const key = `${car.brand}-${car.model}-${car.powertrain}-${car.transmission}`;
          if (!acc[key] || car.totalPrice < acc[key].totalPrice) {
            acc[key] = car;
          }
          return acc;
        }, {})
      );

      // Hämta och kombinera data från /car-models/search
      const stitchedCars = await Promise.all(
        deduped.map(async (car) => {
          const cacheKey = `${car.brand}-${car.model}`;
          if (carModelCache.current[cacheKey]) {
            const carModel = carModelCache.current[cacheKey];
            return {
              ...car,
              ...carModel,
              // Prioritera data från carModel om den finns
              carType: carModel.carType || car.carType,
              powertrain: carModel.powertrain || car.powertrain,
            };
          } else {
            try {
              const response = await api.get('/car-models/search', {
                params: { brand: car.brand, model: car.model }
              });
              const carModel = response.data;
              // Spara resultatet i cachen
              carModelCache.current[cacheKey] = carModel;
              if (carModel && carModel.imageUrl) {
                return {
                  ...car,
                  imageUrl: carModel.imageUrl,
                  fuel: carModel.fuel,
                  fuelCategory: carModel.fuelCategory,
                  carType: carModel.carType || car.carType,
                  powertrain: carModel.powertrain || car.powertrain,
                  electricRange: carModel.electricRange,
                  fourWheelDrive: carModel.fourWheelDrive
                };
              }
            } catch (err) {
              console.error(`Error stitching CarModel for ${car.brand} ${car.model}:`, err);
            }
            return car;
          }
        })
      );

      setFilteredCars(stitchedCars);
    };

    if (cars.length > 0) {
      applyFiltersAndStitch();
    }
  }, [debouncedFilters, cars]);

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
