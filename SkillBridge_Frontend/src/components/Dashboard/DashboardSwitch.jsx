import React from 'react';
import { useAuth } from '../../context/AuthContext';
import BuyerDashboard from './BuyerDashboard';
import SellerDashboard from './SellerDashboard';

const DashboardSwitch = () => {
  const { isSellerMode } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>{isSellerMode ? 'Seller Dashboard' : 'Buyer Dashboard'}</h2>
        <p className="dashboard-subtitle">
          {isSellerMode 
            ? 'Manage your services and earnings' 
            : 'Track your requests and payments'}
        </p>
      </div>
      
      {isSellerMode ? <SellerDashboard /> : <BuyerDashboard />}
    </div>
  );
};

export default DashboardSwitch;