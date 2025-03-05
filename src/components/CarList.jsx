import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Pagination } from 'react-bootstrap';
import api from '../services/api';
import CarCard from './CarCard';
import Fuse from 'fuse.js';
import './CarList.css';

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

  // Paginering
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Cache för bilmodellsdata
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

  // Återställ currentPage till 1 när filtren ändras
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilters]);

  // Applicera filter, sortering och "stitch" med bilmodellsdata
  useEffect(() => {
    const applyFiltersAndStitch = async () => {
      // Rensa gamla resultat innan ny sökning startar
      setFilteredCars([]);
      
      let filtered = [...cars];

      // Fuzzy search med Fuse.js
      if (debouncedFilters && debouncedFilters.searchQuery) {
        const query = preprocessQuery(debouncedFilters.searchQuery);
        // Kombinera brand och model till ett nytt fält "fullName"
        const carsForFuse = filtered.map(car => ({
          ...car,
          fullName: `${car.brand} ${car.model}`
        }));
        const fuseOptions = {
          keys: ['fullName'],
          threshold: 0.3, // Justera tröskeln vid behov
          includeScore: true,
        };
        const fuse = new Fuse(carsForFuse, fuseOptions);
        const fuseResults = fuse.search(query);
        // Bevara även score för relevanssortering
        filtered = fuseResults.map(result => ({ ...result.item, fuseScore: result.score }));
      } else {
        // Rensa eventuell tidigare fuseScore om ingen sökning görs
        filtered = filtered.map(({ fuseScore, ...rest }) => rest);
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
            car.totalPrice <= debouncedFilters.totalPrice.max &&
            car.totalPrice !== 0
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

      // Dedupliceringen togs bort enligt tidigare önskemål

      // Hämta och kombinera data från /car-models/search
      const stitchedCars = await Promise.all(
        filtered.map(async (car) => {
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

      let finalSortedCars = [];
      // Om en sökning gjorts, sortera på relevans (fuseScore) och vid lika score på pris (billigast först)
      if (debouncedFilters && debouncedFilters.searchQuery) {
        finalSortedCars = stitchedCars.sort((a, b) => {
          const scoreA = a.fuseScore !== undefined ? a.fuseScore : Infinity;
          const scoreB = b.fuseScore !== undefined ? b.fuseScore : Infinity;
          if (scoreA === scoreB) {
            return a.totalPrice - b.totalPrice;
          }
          return scoreA - scoreB;
        });
      } else {
        // Sortera på pris om ingen sökning gjorts
        const nonZeroCars = stitchedCars.filter(car => car.totalPrice !== 0);
        const zeroPriceCars = stitchedCars.filter(car => car.totalPrice === 0);
        const sortedNonZero = nonZeroCars.sort((a, b) => a.totalPrice - b.totalPrice);
        finalSortedCars = [...sortedNonZero, ...zeroPriceCars];
      }

      setFilteredCars(finalSortedCars);
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

  // Paginering: beräkna vilka bilar som ska visas på den aktuella sidan
  const totalPages = Math.ceil(filteredCars.length / pageSize);
  const indexOfLastCar = currentPage * pageSize;
  const indexOfFirstCar = indexOfLastCar - pageSize;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  return (
    <div>
      <div className="mb-3">
        <h5>Antal träffar: {filteredCars.length}</h5>
      </div>
      <div className="row">
        {filteredCars.length === 0 ? (
          <div className="col-12">
            <p className="text-center">Inga bilar hittades.</p>
          </div>
        ) : (
          currentCars.map(car => (
            <div key={car.id} className="col-md-4 mb-4">
              <CarCard car={car} />
            </div>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages).keys()].map(num => (
              <Pagination.Item 
                key={num + 1} 
                active={num + 1 === currentPage} 
                onClick={() => setCurrentPage(num + 1)}
                style={num + 1 === currentPage ? { backgroundColor: '#343a40', borderColor: '#343a40', color: 'white' } : {}}
              >
                {num + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default CarList;
