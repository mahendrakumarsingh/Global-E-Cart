const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  console.log('Protect Middleware - Auth Header:', authHeader); // DEBUG

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    console.log('Protect Middleware - No Token Found'); // DEBUG
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Protect Middleware - Decoded Token:', decoded); // DEBUG
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) console.log('Protect Middleware - User Not Found in DB'); // DEBUG
    next();
  } catch (error) {
    console.error('Protect Middleware - Verification Failed:', error.message); // DEBUG
    res.status(401).json({ message: 'Not authorized' });
  }
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) next();
  else res.status(403).json({ message: 'Admin only' });
};
