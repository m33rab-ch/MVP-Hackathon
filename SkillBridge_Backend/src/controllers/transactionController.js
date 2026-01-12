const Transaction = require('../models/Transaction');
const Service = require('../models/Service');
const User = require('../models/User');

// Get transactions for current user (as buyer or seller)
exports.getMyTransactions = async (req, res) => {
  try {
    const { role, status } = req.query;
    
    let query = {};
    
    if (role === 'buyer') {
      query.buyer = req.user._id;
    } else if (role === 'seller') {
      query.seller = req.user._id;
    } else {
      // Get all transactions where user is involved
      query.$or = [
        { buyer: req.user._id },
        { seller: req.user._id }
      ];
    }
    
    if (status) {
      query.status = status;
    }

    const transactions = await Transaction.find(query)
      .populate('buyer', 'name email department')
      .populate('seller', 'name email department')
      .populate('service', 'title category price')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('buyer', 'name email department rating')
      .populate('seller', 'name email department rating skills')
      .populate('service', 'title description price deliveryTime')
      .populate('messages');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Check if user is authorized to view this transaction
    const isBuyer = transaction.buyer._id.toString() === req.user._id.toString();
    const isSeller = transaction.seller._id.toString() === req.user._id.toString();
    
    if (!isBuyer && !isSeller) {
      return res.status(403).json({ error: 'Not authorized to view this transaction' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

// Accept transaction request (seller)
exports.acceptTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      seller: req.user._id,
      status: 'pending'
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or not authorized' });
    }

    transaction.status = 'accepted';
    await transaction.save();

    res.json({
      message: 'Transaction accepted successfully',
      transaction
    });
  } catch (error) {
    console.error('Accept transaction error:', error);
    res.status(500).json({ error: 'Failed to accept transaction' });
  }
};

// Mark advance payment as paid (buyer)
exports.markAdvancePaid = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      buyer: req.user._id,
      status: 'accepted'
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or not authorized' });
    }

    transaction.status = 'advance_paid';
    transaction.payment.advance.paid = true;
    transaction.payment.advance.paidAt = new Date();
    await transaction.save();

    // Update seller's pending earnings
    await User.findByIdAndUpdate(transaction.seller, {
      $inc: { 'earnings.pending': transaction.payment.advance.amount }
    });

    res.json({
      message: 'Advance payment marked as paid',
      transaction
    });
  } catch (error) {
    console.error('Mark advance paid error:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};

// Mark work as completed (seller)
exports.markWorkCompleted = async (req, res) => {
  try {
    const { deliverables } = req.body;
    
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      seller: req.user._id,
      status: 'advance_paid'
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or not authorized' });
    }

    transaction.status = 'work_completed';
    transaction.workDetails.deliverables = deliverables;
    transaction.workDetails.submittedAt = new Date();
    await transaction.save();

    res.json({
      message: 'Work marked as completed',
      transaction
    });
  } catch (error) {
    console.error('Mark work completed error:', error);
    res.status(500).json({ error: 'Failed to update work status' });
  }
};

// Mark final payment as paid (buyer)
exports.markFinalPaid = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      buyer: req.user._id,
      status: 'work_completed'
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or not authorized' });
    }

    transaction.status = 'final_paid';
    transaction.payment.final.paid = true;
    transaction.payment.final.paidAt = new Date();
    await transaction.save();

    // Move pending earnings to total earnings for seller
    await User.findByIdAndUpdate(transaction.seller, {
      $inc: { 
        'earnings.pending': -transaction.payment.advance.amount,
        'earnings.total': transaction.amount
      }
    });

    res.json({
      message: 'Final payment marked as paid',
      transaction
    });
  } catch (error) {
    console.error('Mark final paid error:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};

// Complete transaction (after ratings)
exports.completeTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      $or: [
        { buyer: req.user._id },
        { seller: req.user._id }
      ],
      status: 'final_paid'
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or not authorized' });
    }

    transaction.status = 'completed';
    transaction.completedAt = new Date();
    await transaction.save();

    res.json({
      message: 'Transaction completed successfully',
      transaction
    });
  } catch (error) {
    console.error('Complete transaction error:', error);
    res.status(500).json({ error: 'Failed to complete transaction' });
  }
};

// Submit rating
exports.submitRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const { id, role } = req.params; // role: 'buyer' or 'seller'

    const transaction = await Transaction.findOne({
      _id: id,
      $or: [
        { buyer: req.user._id },
        { seller: req.user._id }
      ],
      status: { $in: ['final_paid', 'completed'] }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or not authorized' });
    }

    // Determine which rating to update
    if (role === 'buyer') {
      // Seller rating buyer
      if (transaction.seller.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Only seller can rate buyer' });
      }
      transaction.sellerRating = { rating, review, ratedAt: new Date() };
    } else if (role === 'seller') {
      // Buyer rating seller
      if (transaction.buyer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Only buyer can rate seller' });
      }
      transaction.buyerRating = { rating, review, ratedAt: new Date() };
    } else {
      return res.status(400).json({ error: 'Invalid rating role' });
    }

    await transaction.save();

    // Update user's average rating
    if (role === 'seller') {
      await updateUserRating(transaction.seller);
    }

    res.json({
      message: 'Rating submitted successfully',
      transaction
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
};

// Helper function to update user rating
async function updateUserRating(userId) {
  const transactions = await Transaction.find({
    seller: userId,
    'buyerRating.rating': { $exists: true }
  });

  if (transactions.length > 0) {
    const totalRating = transactions.reduce((sum, t) => sum + t.buyerRating.rating, 0);
    const averageRating = totalRating / transactions.length;

    await User.findByIdAndUpdate(userId, {
      'rating.average': averageRating,
      'rating.count': transactions.length
    });
  }
}