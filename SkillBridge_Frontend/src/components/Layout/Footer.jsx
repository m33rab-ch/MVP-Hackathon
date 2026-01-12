import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>SkillBridge</h3>
          <p>UCP Student Marketplace</p>
          <p>Connecting talent with opportunity</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/marketplace">Marketplace</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>University of Central Punjab, Lahore</p>
          <p>Email: support@skillbridge.ucp.edu.pk</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2024 SkillBridge - UCP Hackathon Project. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;