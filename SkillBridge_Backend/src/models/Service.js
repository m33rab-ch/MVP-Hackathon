const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Academic Tutoring',
      'Design & Media', 
      'Tech Services',
      'Writing & Content',
      'Other Skills'
    ]
  },
  price: {
    type: Number,
    required: true,
    min: 100,
    max: 10000
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deliveryTime: {
    type: Number, // in days
    required: true,
    min: 1,
    max: 30
  },
  images: [{
    type: String // URLs to images
  }],
  status: {
    type: String,
    enum: ['active', 'paused', 'sold_out'],
    default: 'active'
  },
  tags: [{
    type: String,
    trim: true
  }],
  requestCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update timestamp on save
serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search
serviceSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;