const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'skillbridge-secret-key');
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

const isUCPEmail = (req, res, next) => {
  const email = req.body.email;
  
  if (email && !email.endsWith('@ucp.edu.pk')) {
    return res.status(400).json({ 
      error: 'Only UCP email addresses allowed (@ucp.edu.pk)' 
    });
  }
  
  next();
};

module.exports = { auth, isUCPEmail };