const express = require('express');
const router = express.Router();
const {
  getMyTransactions,
  getTransactionById,
  acceptTransaction,
  markAdvancePaid,
  markWorkCompleted,
  markFinalPaid,
  completeTransaction,
  submitRating
} = require('../controllers/transactionController');
const { auth } = require('../middleware/auth');

// Protected routes
router.get('/my-transactions', auth, getMyTransactions);
router.get('/:id', auth, getTransactionById);
router.put('/:id/accept', auth, acceptTransaction);
router.put('/:id/advance-paid', auth, markAdvancePaid);
router.put('/:id/work-completed', auth, markWorkCompleted);
router.put('/:id/final-paid', auth, markFinalPaid);
router.put('/:id/complete', auth, completeTransaction);
router.post('/:id/rate/:role', auth, submitRating); // role: buyer or seller

module.exports = router;