import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleContactSeller = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Navigate to chat with seller
    navigate(`/messages?user=${service.seller._id}&service=${service._id}`);
  };

  const handleSaveService = () => {
    // Save service to favorites
    console.log('Save service:', service._id);
  };

  return (
    <div className="service-card">
      <div className="service-card-header">
        <div className="service-category">
          {service.category}
        </div>
        <button 
          onClick={handleSaveService}
          className="save-btn"
          aria-label="Save service"
        >
          ♡
        </button>
      </div>
      
      <div className="service-card-body">
        <h3 className="service-title">{service.title}</h3>
        <p className="service-description">
          {service.description.length > 120 
            ? `${service.description.substring(0, 120)}...` 
            : service.description}
        </p>
        
        <div className="service-seller">
          <div className="seller-avatar">
            {service.seller.name.charAt(0)}
          </div>
          <div className="seller-info">
            <span className="seller-name">{service.seller.name}</span>
            <span className="seller-department">{service.seller.department}</span>
          </div>
          <div className="seller-rating">
            ★ {service.seller.avgRating || 'New'}
          </div>
        </div>
      </div>
      
      <div className="service-card-footer">
        <div className="service-price">
          <span className="price-amount">₹{service.price}</span>
          <span className="price-note">per service</span>
        </div>
        
        <div className="service-actions">
          <button 
            onClick={handleContactSeller}
            className="btn btn-contact"
          >
            Contact Seller
          </button>
          <button className="btn btn-details">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;