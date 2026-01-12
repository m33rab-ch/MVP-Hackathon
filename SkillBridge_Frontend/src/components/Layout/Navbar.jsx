import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isSellerMode, toggleSellerMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">SkillBridge</Link>
          <span className="navbar-tagline">UCP Student Marketplace</span>
        </div>
        
        <div className="navbar-menu">
          <Link to="/marketplace" className="nav-link">Marketplace</Link>
          
          {user && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/messages" className="nav-link">Messages</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              
              {/* Seller Mode Toggle */}
              <button 
                className={`seller-toggle ${isSellerMode ? 'active' : ''}`}
                onClick={toggleSellerMode}
              >
                {isSellerMode ? 'Seller Mode' : 'Buyer Mode'}
              </button>
            </>
          )}
        </div>
        
        <div className="navbar-auth">
          {user ? (
            <div className="user-info">
              <span className="user-email">{user.email}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="auth-btn login-btn">Login</Link>
              <Link to="/register" className="auth-btn register-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;