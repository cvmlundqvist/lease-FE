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

  // Fetch car data from the API
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

  // Compute unique filter options
  const uniqueBrands = Array.from(new Set(cars.map(car => car.brand)));
  const uniqueSuppliers = Array.from(new Set(cars.map(car => car.supplier)));
  const uniquePowertrains = Array.from(new Set(cars.map(car => car.powertrain)));
  const uniqueTransmissions = Array.from(new Set(cars.map(car => car.transmission)));
  const uniqueCarTypes = Array.from(new Set(cars.map(car => car.carType)));

  // Function to find the maximum total price
  const getMaxTotalPrice = () => {
    if (cars.length === 0) return 50000;
    return Math.max(...cars.map(car => car.totalPrice));
  };

  const computedMaxTotalPrice = getMaxTotalPrice();

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
              totalPriceRange={{ min: 0, max: computedMaxTotalPrice }}
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
