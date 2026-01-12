const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 100
  },
  status: {
    type: String,
    enum: [
      'pending',          // Request sent
      'accepted',         // Seller accepted
      'advance_paid',     // 25% paid
      'in_progress',      // Work started
      'work_completed',   // Work delivered
      'final_paid',       // 75% paid
      'completed',        // All done
      'cancelled',        // Cancelled
      'disputed'          // Dispute raised
    ],
    default: 'pending'
  },
  payment: {
    advance: {
      paid: { type: Boolean, default: false },
      amount: { type: Number },
      paidAt: { type: Date }
    },
    final: {
      paid: { type: Boolean, default: false },
      amount: { type: Number },
      paidAt: { type: Date }
    },
    platformFee: {
      type: Number,
      default: 0
    }
  },
  workDetails: {
    requirements: String,
    deliverables: [String],
    deadline: Date,
    submittedAt: Date
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  buyerRating: {
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    ratedAt: Date
  },
  sellerRating: {
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    ratedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Update seller earnings when transaction completes
transactionSchema.post('save', async function(doc) {
  if (doc.status === 'completed') {
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(doc.seller, {
      $inc: { 'earnings.total': doc.amount }
    });
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;