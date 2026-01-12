import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createService } from '../../services/api';

const CreateService = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic Tutoring',
    description: '',
    price: '',
    deliveryTime: '3' // days
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    'Academic Tutoring',
    'Design & Media',
    'Tech Services',
    'Writing & Content',
    'Other Skills'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to create a service');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await createService(formData);
      alert('Service created successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Error creating service: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-service-container">
      <div className="create-service-header">
        <h2>Create New Service</h2>
        <p>Offer your skills to UCP students</p>
      </div>

      <form onSubmit={handleSubmit} className="service-form">
        <div className="form-group">
          <label htmlFor="title">Service Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Python Programming Help"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (₹) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g., 1000"
            min="100"
            required
          />
          <small>Minimum ₹100 per service</small>
        </div>

        <div className="form-group">
          <label htmlFor="deliveryTime">Delivery Time (Days) *</label>
          <select
            id="deliveryTime"
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleChange}
            required
          >
            <option value="1">1 day</option>
            <option value="2">2 days</option>
            <option value="3">3 days</option>
            <option value="5">5 days</option>
            <option value="7">7 days</option>
            <option value="14">14 days</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what you'll do, your expertise, what the buyer gets..."
            rows="5"
            required
          />
          <small>Be clear about what you offer and any requirements</small>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Creating...' : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateService;