const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../utils/AppError');

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new AppError('Not authenticated. Please log in.', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError('User no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired. Please log in again.', 401));
    } else {
      next(error);
    }
  }
};

module.exports = authenticate;
