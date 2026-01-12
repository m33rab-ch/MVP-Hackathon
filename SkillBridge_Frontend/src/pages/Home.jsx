import React from 'react';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to SkillBridge</h1>
        <p>UCP's Trusted Student Marketplace</p>
        <p>Find help or earn money from verified UCP students</p>
        <div className="hero-buttons">
          <a href="/marketplace" className="btn btn-primary">Browse Services</a>
          <a href="/register" className="btn btn-secondary">Get Started</a>
        </div>
      </div>
    </div>
  );
};

export default Home;