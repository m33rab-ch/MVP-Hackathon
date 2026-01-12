import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSellerServices, getSellerEarnings } from '../../services/api';

const SellerDashboard = () => {
  const [services, setServices] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, pending: 0, received: 0 });
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      const [sellerServices, sellerEarnings] = await Promise.all([
        getSellerServices(),
        getSellerEarnings()
      ]);
      setServices(sellerServices);
      setEarnings(sellerEarnings);
    } catch (error) {
      console.error('Error fetching seller data:', error);
    }
  };

  const formatEarnings = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="seller-dashboard">
      {/* Earnings Summary */}
      <div className="earnings-summary">
        <div className="earnings-card total">
          <h4>Total Earnings</h4>
          <p className="earnings-amount">{formatEarnings(earnings.total)}</p>
        </div>
        <div className="earnings-card pending">
          <h4>Pending</h4>
          <p className="earnings-amount">{formatEarnings(earnings.pending)}</p>
          <small>25% advances received</small>
        </div>
        <div className="earnings-card received">
          <h4>Received</h4>
          <p className="earnings-amount">{formatEarnings(earnings.received)}</p>
          <small>After 75% completion</small>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          My Services ({services.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ratings' ? 'active' : ''}`}
          onClick={() => setActiveTab('ratings')}
        >
          Ratings
        </button>
      </div>

      {activeTab === 'services' && (
        <div className="services-section">
          <div className="section-header">
            <h3>My Listed Services</h3>
            <Link to="/marketplace/create" className="btn btn-primary">
              + Add New Service
            </Link>
          </div>
          
          {services.length === 0 ? (
            <div className="empty-state">
              <p>No services listed yet. Create your first service!</p>
              <Link to="/marketplace/create" className="btn btn-primary">
                Create First Service
              </Link>
            </div>
          ) : (
            <div className="services-grid">
              {services.map(service => (
                <div key={service._id} className="service-card">
                  <div className="service-header">
                    <h4>{service.title}</h4>
                    <span className={`service-status ${service.status}`}>
                      {service.status}
                    </span>
                  </div>
                  <p className="service-description">{service.description.substring(0, 120)}...</p>
                  <div className="service-footer">
                    <div className="service-stats">
                      <span className="price">₹{service.price}</span>
                      <span className="requests">{service.requestCount} requests</span>
                      <span className="rating">★ {service.avgRating || 'No ratings'}</span>
                    </div>
                    <div className="service-actions">
                      <button className="btn btn-edit">Edit</button>
                      <button className="btn btn-delete">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;