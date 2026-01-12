const express = require('express');
const router = express.Router();
const {
  createService,
  getServices,
  getServiceById,
  getMyServices,
  updateService,
  deleteService,
  requestService
} = require('../controllers/serviceController');
const { auth } = require('../middleware/auth');

// Public routes
router.get('/', getServices);
router.get('/:id', getServiceById);

// Protected routes
router.post('/', auth, createService);
router.post('/request', auth, requestService);
router.get('/user/my-services', auth, getMyServices);
router.put('/:id', auth, updateService);
router.delete('/:id', auth, deleteService);

module.exports = router;