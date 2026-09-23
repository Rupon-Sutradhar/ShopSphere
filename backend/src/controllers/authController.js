const { AppError } = require('../utils/AppError');
const authService = require('../services/authService');
const generateToken = require('../utils/generateToken');

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        throw new AppError('Please provide name, email, and password', 400);
      }

      const user = await authService.registerUser({ name, email, password });
      generateToken(user._id, res);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
      }

      const user = await authService.loginUser({ email, password });
      generateToken(user._id, res);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  logout(req, res) {
    res.cookie('token', '', { 
      httpOnly: true, 
      expires: new Date(0), 
      path: '/' 
    });
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getUserById(req.user._id);
      
      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
