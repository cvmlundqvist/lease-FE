import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Button } from 'react-bootstrap';
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
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc': Billigast först, 'desc': Dyrast först

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

  // Applicera filter, sortering och "stitch" med bilmodellsdata
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
            car.carType && car.carType.toLowerCase().includes(debouncedFilters.carType.toLowerCase())
          );
        }
        if (debouncedFilters.totalPrice) {
          filtered = filtered.filter(car =>
            car.totalPrice >= debouncedFilters.totalPrice.min &&
            car.totalPrice <= debouncedFilters.totalPrice.max
            && car.totalPrice !== 0
          );
        }
        // Filtrera med contractMonths (istället för bindingTime)
        if (debouncedFilters && debouncedFilters.bindingTime !== undefined) {
          filtered = filtered.filter(car => {
            return car.contractMonths !== undefined
              ? car.contractMonths <= debouncedFilters.bindingTime
              : true;
          });
        }
        if (debouncedFilters.minMileage !== undefined) {
          filtered = filtered.filter(car => {
            let monthlyMileage = car.mileagePerMonths;
        
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
              imageUrl: carModel.imageUrl,
              fuel: carModel.fuel,
              fuelCategory: carModel.fuelCategory,
              carType: carModel.carType || car.carType,
              powertrain: carModel.powertrain || car.powertrain,
              electricRange: carModel.electricRange || car.electricRange,
              fourWheelDrive: carModel.fourWheelDrive || car.fourWheelDrive,
              modelDescription: carModel.modelDescription || car.modelDescription
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
                  electricRange: carModel.electricRange || car.electricRange,
                  fourWheelDrive: carModel.fourWheelDrive || car.fourWheelDrive,
                  modelDescription: carModel.modelDescription || car.modelDescription
                };
              }
            } catch (err) {
              console.error(`Error stitching CarModel for ${car.brand} ${car.model}:`, err);
            }
            return car;
          }
        })
      );

      // Dela upp listan: bilar med totalPrice !== 0 och de med totalPrice === 0
      const nonZeroCars = stitchedCars.filter(car => car.totalPrice !== 0);
      const zeroPriceCars = stitchedCars.filter(car => car.totalPrice === 0);

      // Sortera de med icke-noll priser
      const sortedNonZero = nonZeroCars.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.totalPrice - b.totalPrice;
        } else {
          return b.totalPrice - a.totalPrice;
        }
      });

      // Slå ihop listan, nollpriserna hamnar sist
      const finalSortedCars = [...sortedNonZero, ...zeroPriceCars];

      setFilteredCars(finalSortedCars);
    };

    if (cars.length > 0) {
      applyFiltersAndStitch();
    }
  }, [debouncedFilters, cars, sortOrder]);

  if (loading) {
    return <div className="text-center mt-5">Laddar bilar...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  return (
    <div>
      <div className="mb-3">
        <h5>Antal träffar: {filteredCars.length}</h5>
      </div>
      {/* Sorteringsknapp, om du vill ha den - annars kan den kommenteras bort */}
      {/*
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="outline-primary"
          onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
        >
          Sortera: {sortOrder === 'asc' ? "Billigast först" : "Dyrast först"}
        </Button>
      </div>
      */}
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
    </div>
  );
};

export default CarList;
