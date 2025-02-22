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
        <FilterBar 
          onFilterChange={handleFilterChange} 
          totalPriceRange={{ min: 0, max: maxTotalPrice }} 
        />
        {loading 
          ? <div className="text-center mt-5">Laddar bilar...</div>
          : <CarList filters={filters} />
        }
      </div>
    </div>
  );
}

export default App;
