// src/services/api.js
const API_BASE = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('skillbridge_token');
};

// Get current user from localStorage
const getCurrentUser = () => {
  const userStr = localStorage.getItem('skillbridge_user');
  return userStr ? JSON.parse(userStr) : null;
};

// Main API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };
  
  // Add body if present (but not for GET/HEAD)
  if (options.body && !['GET', 'HEAD'].includes(options.method?.toUpperCase() || 'GET')) {
    config.body = JSON.stringify(options.body);
  }
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    // Handle HTTP errors
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If response is not JSON, try to get text
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
      
      throw new Error(errorMessage);
    }
    
    // Parse successful response
    try {
      const data = await response.json();
      return data;
    } catch {
      // If response is empty or not JSON
      return { success: true };
    }
    
  } catch (error) {
    console.error(`API Error at ${endpoint}:`, error.message);
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Make sure backend is running on http://localhost:5000');
    }
    
    throw error;
  }
};

// ==================== AUTHENTICATION ====================

export const login = async (email, password) => {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  
  if (response.token && response.user) {
    localStorage.setItem('skillbridge_token', response.token);
    localStorage.setItem('skillbridge_user', JSON.stringify(response.user));
  }
  
  return response;
};

export const register = async (userData) => {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: userData,
  });
  
  if (response.token && response.user) {
    localStorage.setItem('skillbridge_token', response.token);
    localStorage.setItem('skillbridge_user', JSON.stringify(response.user));
  }
  
  return response;
};

export const getProfile = async () => {
  return apiRequest('/auth/profile');
};

export const updateProfile = async (updates) => {
  return apiRequest('/auth/profile', {
    method: 'PUT',
    body: updates,
  });
};

export const logout = () => {
  localStorage.removeItem('skillbridge_token');
  localStorage.removeItem('skillbridge_user');
  localStorage.removeItem('seller_mode');
  return Promise.resolve();
};

// ==================== SERVICES ====================

export const getServices = async (filters = {}) => {
  // Convert filters to query string
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  const url = `/services${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiRequest(url);
  return response.services || [];
};

export const getService = async (id) => {
  return apiRequest(`/services/${id}`);
};

export const createService = async (serviceData) => {
  return apiRequest('/services', {
    method: 'POST',
    body: serviceData,
  });
};

export const getMyServices = async () => {
  const response = await apiRequest('/services/user/my-services');
  return response || [];
};

export const updateService = async (id, updates) => {
  return apiRequest(`/services/${id}`, {
    method: 'PUT',
    body: updates,
  });
};

export const deleteService = async (id) => {
  return apiRequest(`/services/${id}`, {
    method: 'DELETE',
  });
};

export const requestService = async (serviceId, requirements) => {
  return apiRequest('/services/request', {
    method: 'POST',
    body: { serviceId, requirements },
  });
};

// ==================== TRANSACTIONS ====================

export const getTransactions = async (role = 'all') => {
  const response = await apiRequest(`/transactions/my-transactions?role=${role}`);
  return response || [];
};

export const getTransaction = async (id) => {
  return apiRequest(`/transactions/${id}`);
};

export const acceptTransactionRequest = async (id) => {
  return apiRequest(`/transactions/${id}/accept`, {
    method: 'PUT',
  });
};

export const markAdvancePaid = async (id) => {
  return apiRequest(`/transactions/${id}/advance-paid`, {
    method: 'PUT',
  });
};

export const markWorkCompleted = async (id, deliverables) => {
  return apiRequest(`/transactions/${id}/work-completed`, {
    method: 'PUT',
    body: { deliverables },
  });
};

export const markFinalPaid = async (id) => {
  return apiRequest(`/transactions/${id}/final-paid`, {
    method: 'PUT',
  });
};

export const completeTransaction = async (id) => {
  return apiRequest(`/transactions/${id}/complete`, {
    method: 'PUT',
  });
};

export const rateUser = async (transactionId, role, rating, review = '') => {
  return apiRequest(`/transactions/${transactionId}/rate/${role}`, {
    method: 'POST',
    body: { rating, review },
  });
};

// ==================== MESSAGES ====================

export const getConversations = async () => {
  const response = await apiRequest('/messages/conversations');
  return response || [];
};

export const getMessages = async (userId) => {
  const response = await apiRequest(`/messages/${userId}`);
  return response || [];
};

export const sendMessage = async (userId, content, transactionId = null) => {
  return apiRequest(`/messages/${userId}`, {
    method: 'POST',
    body: { content, transactionId },
  });
};

// ==================== USERS ====================

export const getUser = async (id) => {
  return apiRequest(`/users/${id}`);
};

export const getEarnings = async () => {
  const response = await apiRequest('/users/earnings');
  return response || {};
};

export const updateUserSkills = async (skills) => {
  return apiRequest('/users/skills', {
    method: 'PUT',
    body: { skills },
  });
};

// ==================== UTILITY ====================

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    return data.status === 'OK';
  } catch (error) {
    return false;
  }
};

// Helper to get current user ID
export const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user ? user._id : null;
};

// Export all functions
export default {
  // Auth
  login,
  register,
  getProfile,
  updateProfile,
  logout,
  
  // Services
  getServices,
  getService,
  createService,
  getMyServices,
  updateService,
  deleteService,
  requestService,
  
  // Transactions
  getTransactions,
  getTransaction,
  acceptTransactionRequest,
  markAdvancePaid,
  markWorkCompleted,
  markFinalPaid,
  completeTransaction,
  rateUser,
  
  // Messages
  getConversations,
  getMessages,
  sendMessage,
  
  // Users
  getUser,
  getEarnings,
  updateUserSkills,
  
  // Utility
  checkBackendHealth,
  getCurrentUserId,
  getCurrentUser,
};