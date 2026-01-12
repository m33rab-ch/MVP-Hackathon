import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';
import { getAllServices } from '../../services/api';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [categories] = useState([
    'Academic Tutoring',
    'Design & Media',
    'Tech Services',
    'Writing & Content',
    'Other Skills'
  ]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getAllServices(filters);
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchServices();
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '' });
    fetchServices();
  };

  return (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <h2>UCP Services Marketplace</h2>
        <p>Find help from verified UCP students or offer your skills</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <select 
            name="category" 
            value={filters.category}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <span className="filter-separator">to</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>
        
        <div className="filter-actions">
          <button onClick={applyFilters} className="btn btn-apply">
            Apply Filters
          </button>
          <button onClick={clearFilters} className="btn btn-clear">
            Clear
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="loading-spinner">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="empty-marketplace">
          <p>No services found. Be the first to list a service!</p>
        </div>
      ) : (
        <div className="services-grid">
          {services.map(service => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceList;