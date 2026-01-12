const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9._%+-]+@ucp\.edu\.pk$/.test(v);
      },
      message: 'Only UCP email addresses allowed (@ucp.edu.pk)'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  department: {
    type: String,
    required: true,
    enum: [
      'Computer Science',
      'Software Engineering', 
      'Electrical Engineering',
      'Business Administration',
      'Fine Arts',
      'Psychology',
      'Mathematics',
      'Physics',
      'Other'
    ]
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  skills: [{
    type: String,
    trim: true
  }],
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  earnings: {
    total: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    }
  },
  isVerified: {
    type: Boolean,
    default: true // For hackathon, auto-verify
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full profile info
userSchema.virtual('profileInfo').get(function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    department: this.department,
    year: this.year,
    rating: this.rating,
    skills: this.skills,
    bio: this.bio
  };
});

const User = mongoose.model('User', userSchema);
module.exports = User;