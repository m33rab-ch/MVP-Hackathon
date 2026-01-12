const express = require('express');
const router = express.Router();
const { 
  getUserProfile,
  updateUserSkills,
  getUserTransactions,
  getUserEarnings
} = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Public routes (user profiles)
router.get('/:id', getUserProfile);

// Protected routes
router.put('/skills', auth, updateUserSkills);
router.get('/:id/transactions', auth, getUserTransactions);
router.get('/earnings', auth, getUserEarnings);

module.exports = router;