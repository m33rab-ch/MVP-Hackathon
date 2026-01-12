// src/services/auth.js - Minimal version (optional)
// This file is not needed if using api.js directly

// Just re-export from api.js
import {
  login,
  register,
  logout,
  getProfile
} from './api';

export {
  login,
  register,
  logout,
  getProfile
};

// Or better yet, DELETE this file and use api.js directly