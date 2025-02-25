import React, { useState, useEffect, useCallback, useMemo } from 'react';
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import CarList from './components/CarList';
import Footer from './components/Footer';
import api from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

function App() {
  const [filters, setFilters] = useState({});
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxTotalPrice, setMaxTotalPrice] = useState(25000);
  const [uniqueFilters, setUniqueFilters] = useState({
    fuels: [],
    fuelCategories: [],
    carTypes: [],
    powertrains: [],
    electricRanges: []
  });

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

  // Hämta unika filter från /api/car-models/unique
  useEffect(() => {
    api.get('/car-models/unique')
      .then(response => {
        setUniqueFilters(response.data);
      })
      .catch(err => {
        console.error('Error fetching unique filters:', err);
      });
  }, []);

  // Extrahera unika värden från bil-datan för vissa filteralternativ
  const uniqueBrands = Array.from(new Set(cars.map(car => car.brand)));
  const uniqueSuppliers = Array.from(new Set(cars.map(car => car.supplier)));

  // Beräkna minimumpriset baserat på cars-arrayen
  const minTotalPrice = useMemo(() => {
    return cars.length ? Math.min(...cars.map(car => car.totalPrice)) : 0;
  }, [cars]);

  // Memoisera filterhanteraren för att undvika onödiga re-renders
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

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
              totalPriceRange={{ min: minTotalPrice, max: maxTotalPrice }} 
              brands={uniqueBrands}
              suppliers={uniqueSuppliers}
              transmissions={uniqueFilters.powertrains}
              powertrains={uniqueFilters.fuelCategories}
              carTypes={uniqueFilters.carTypes}
              fuels={uniqueFilters.fuels}
              fuelCategories={uniqueFilters.fuelCategories}
              electricRanges={uniqueFilters.electricRanges}
            />
          </div>
        </div>
        {loading 
          ? <div className="text-center mt-5">Laddar bilar...</div>
          : <CarList filters={filters} />
        }
      </div>
      <Footer />
    </div>
  );
}

export default App;
