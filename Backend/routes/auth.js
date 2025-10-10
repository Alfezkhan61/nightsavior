const express = require('express');
const router = express.Router();

// Import controllers
const {
  signup,
  login,
  getMe,
  updateProfile
} = require('../controllers/authController');

// Import middleware
const { protect } = require('../middleware/auth');
const { validateSignup, validateLogin } = require('../middleware/validate');

// Routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router; 