import React, { useState, useEffect } from 'react';
import { getBuyerRequests, getSavedServices } from '../../services/api';

const BuyerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [savedServices, setSavedServices] = useState([]);
  const [activeTab, setActiveTab] = useState('requests');

  useEffect(() => {
    fetchBuyerData();
  }, []);

  const fetchBuyerData = async () => {
    try {
      const [buyerRequests, saved] = await Promise.all([
        getBuyerRequests(),
        getSavedServices()
      ]);
      setRequests(buyerRequests);
      setSavedServices(saved);
    } catch (error) {
      console.error('Error fetching buyer data:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { class: 'status-pending', text: 'Pending' },
      'accepted': { class: 'status-accepted', text: 'Accepted' },
      'in_progress': { class: 'status-progress', text: 'In Progress' },
      'completed': { class: 'status-completed', text: 'Completed' },
      'cancelled': { class: 'status-cancelled', text: 'Cancelled' }
    };
    const badge = statusMap[status] || { class: 'status-default', text: status };
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  const getPaymentStatus = (payment) => {
    if (payment.advance_paid && payment.final_paid) return 'Paid Fully';
    if (payment.advance_paid) return '25% Paid';
    return 'Not Paid';
  };

  return (
    <div className="buyer-dashboard">
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          My Requests ({requests.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved Services ({savedServices.length})
        </button>
      </div>

      {activeTab === 'requests' && (
        <div className="requests-section">
          <h3>My Service Requests</h3>
          {requests.length === 0 ? (
            <p className="empty-state">No requests yet. Browse marketplace to hire someone!</p>
          ) : (
            <div className="requests-grid">
              {requests.map(request => (
                <div key={request._id} className="request-card">
                  <div className="request-header">
                    <h4>{request.service.title}</h4>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="request-description">{request.service.description.substring(0, 100)}...</p>
                  <div className="request-details">
                    <span className="price">Price: ₹{request.service.price}</span>
                    <span className="seller">Seller: {request.seller.name}</span>
                    <span className="payment-status">
                      Payment: {getPaymentStatus(request.payment)}
                    </span>
                  </div>
                  <div className="request-actions">
                    <button className="btn btn-chat">Message Seller</button>
                    {request.status === 'completed' && !request.rated && (
                      <button className="btn btn-rate">Rate Service</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="saved-section">
          <h3>Saved Services</h3>
          {savedServices.length === 0 ? (
            <p className="empty-state">No saved services yet.</p>
          ) : (
            <div className="saved-grid">
              {savedServices.map(service => (
                <div key={service._id} className="saved-card">
                  <h4>{service.title}</h4>
                  <p className="saved-description">{service.description.substring(0, 80)}...</p>
                  <div className="saved-footer">
                    <span className="saved-price">₹{service.price}</span>
                    <button className="btn btn-hire">Hire Now</button>
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

export default BuyerDashboard;