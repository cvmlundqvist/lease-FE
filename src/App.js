import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import CarList from './components/CarList';
import api from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

function App() {
  const [filters, setFilters] = useState({});
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxTotalPrice, setMaxTotalPrice] = useState(25000);

  // Hämta bil-datan
  useEffect(() => {
    api.get('/cars')
      .then(response => {
        setCars(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Hämta den dyraste bilen via API för att få maxTotalPrice
  useEffect(() => {
    api.get('/cars/most-expensive')
      .then(response => {
        const car = response.data;
        if (car && car.totalPrice) {
          setMaxTotalPrice(car.totalPrice);
        }
      })
      .catch(err => {
        console.error('Error fetching most expensive car:', err);
      });
  }, []);

  // Extrahera unika värden från bil-datan för filteralternativ
  const uniqueBrands = Array.from(new Set(cars.map(car => car.brand)));
  const uniqueSuppliers = Array.from(new Set(cars.map(car => car.supplier)));
  const uniquePowertrains = Array.from(new Set(cars.map(car => car.powertrain)));
  const uniqueTransmissions = Array.from(new Set(cars.map(car => car.transmission)));
  const uniqueCarTypes = Array.from(new Set(cars.map(car => car.carType)));

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  return (
    <div>
      <HeroSection onSearch={handleSearch} />
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <FilterBar 
              onFilterChange={handleFilterChange} 
              totalPriceRange={{ min: 0, max: maxTotalPrice }} 
              brands={uniqueBrands}
              suppliers={uniqueSuppliers}
              powertrains={uniquePowertrains}
              transmissions={uniqueTransmissions}
              carTypes={uniqueCarTypes}
            />
          </div>
        </div>
        {loading 
          ? <div className="text-center mt-5">Laddar bilar...</div>
          : <CarList filters={filters} />
        }
      </div>
    </div>
  );
}

export default App;
