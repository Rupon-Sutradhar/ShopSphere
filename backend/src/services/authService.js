const { AppError } = require('../utils/AppError');
const User = require('../models/User');

class AuthService {
  async registerUser({ name, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const user = await User.create({ name, email, password });
    
    user.password = undefined;
    return user;
  }

  async loginUser({ email, password }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    user.password = undefined;
    return user;
  }

  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
}

module.exports = new AuthService();
