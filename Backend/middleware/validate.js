const { validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Validation rules for user registration
const validateSignup = [
  require('express-validator').body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  require('express-validator').body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  require('express-validator').body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  require('express-validator').body('role')
    .optional()
    .isIn(['user', 'poster', 'admin'])
    .withMessage('Role must be user, poster, or admin'),
  
  handleValidationErrors
];

// Validation rules for user login
const validateLogin = [
  require('express-validator').body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  require('express-validator').body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Validation rules for shop creation
const validateShop = [
  require('express-validator').body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Shop name must be between 2 and 100 characters'),
  
  require('express-validator').body('category')
    .isIn(['food', 'medical', 'other'])
    .withMessage('Category must be food, medical, or other'),
  
  require('express-validator').body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  
  require('express-validator').body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  require('express-validator').body('location.coordinates.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  require('express-validator').body('location.coordinates.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  require('express-validator').body('openTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Opening time must be in HH:MM format'),
  
  require('express-validator').body('closeTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Closing time must be in HH:MM format'),
  
  require('express-validator').body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  require('express-validator').body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  
  handleValidationErrors
];

// Validation rules for report creation
const validateReport = [
  require('express-validator').body('shopId')
    .isMongoId()
    .withMessage('Invalid shop ID'),
  
  require('express-validator').body('reason')
    .isIn(['inaccurate_hours', 'shop_closed', 'wrong_location', 'inappropriate_content', 'spam', 'other'])
    .withMessage('Invalid report reason'),
  
  require('express-validator').body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateSignup,
  validateLogin,
  validateShop,
  validateReport
}; 