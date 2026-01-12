// Mock API service - Replace with real API calls
const API_BASE = 'http://localhost:5173/api';


// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
};

// Auth API
export const loginAPI = async (email, password) => {
  // Mock response
  return {
    _id: 'user123',
    email,
    name: email.split('@')[0],
    department: 'Computer Science',
    year: 3,
    token: 'mock-jwt-token'
  };
};

export const registerAPI = async (userData) => {
  // Mock response
  return {
    _id: 'user' + Date.now(),
    ...userData,
    token: 'mock-jwt-token'
  };
};

// Services API
export const getAllServices = async (filters = {}) => {
  // Mock data
  return [
    {
      _id: '1',
      title: 'Python Programming Help',
      description: 'Get help with Python assignments and projects. Expert in Django, Flask, and data science libraries.',
      category: 'Tech Services',
      price: 800,
      seller: {
        _id: 'seller1',
        name: 'Ali Ahmed',
        department: 'Computer Science',
        avgRating: 4.5
      }
    },
    {
      _id: '2',
      title: 'Graphic Design for Projects',
      description: 'Professional logo design, posters, and presentation slides for your academic projects.',
      category: 'Design & Media',
      price: 1200,
      seller: {
        _id: 'seller2',
        name: 'Sara Khan',
        department: 'Fine Arts',
        avgRating: 4.8
      }
    },
    // Add more mock services as needed
  ];
};

export const createService = async (serviceData) => {
  // Mock response
  return {
    _id: 'service' + Date.now(),
    ...serviceData,
    createdAt: new Date().toISOString()
  };
};

export const getSellerServices = async () => {
  // Mock response
  return [
    {
      _id: '1',
      title: 'Web Development Help',
      description: 'Build websites using HTML, CSS, JavaScript, React',
      category: 'Tech Services',
      price: 1500,
      status: 'active',
      requestCount: 3,
      avgRating: 4.7
    }
  ];
};

// Dashboard API
export const getBuyerRequests = async () => {
  // Mock response
  return [
    {
      _id: 'req1',
      service: {
        title: 'Logo Design',
        description: 'Design a logo for startup',
        price: 1000
      },
      seller: {
        name: 'Sara Khan'
      },
      status: 'in_progress',
      payment: {
        advance_paid: true,
        final_paid: false
      },
      rated: false
    }
  ];
};

export const getSellerEarnings = async () => {
  // Mock response
  return {
    total: 4500,
    pending: 1500,
    received: 3000
  };
};

// Messages API
export const getMessages = async (chatId) => {
  // Mock response
  return [
    {
      _id: 'msg1',
      content: 'Hi, I need help with my Python project',
      sender: 'buyer1',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      _id: 'msg2',
      content: 'Sure, I can help. What do you need?',
      sender: 'seller1',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    }
  ];
};

export const sendMessage = async (messageData) => {
  // Mock response
  return {
    _id: 'msg' + Date.now(),
    ...messageData,
    timestamp: new Date().toISOString()
  };
};

export default {
  loginAPI,
  registerAPI,
  getAllServices,
  createService,
  getSellerServices,
  getBuyerRequests,
  getSellerEarnings,
  getMessages,
  sendMessage
};