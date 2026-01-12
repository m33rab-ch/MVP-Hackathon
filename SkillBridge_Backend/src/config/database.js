const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // For development - use local MongoDB or MongoDB Atlas
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbridge';
    
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };