const express = require('express');
const router = express.Router();

// Import controllers
const {
  createShop,
  getOpenShops,
  getShopById,
  updateShop,
  getMyShops
} = require('../controllers/shopController');

// Import middleware
const { protect, isPoster } = require('../middleware/auth');
const { validateShop } = require('../middleware/validate');

// Routes
router.get('/open-now', getOpenShops);
router.get('/:id', getShopById);

// Protected routes
router.use(protect); // Apply authentication to all routes below

router.get('/my-shops', getMyShops);
router.post('/', isPoster, validateShop, createShop);
router.put('/:id', validateShop, updateShop);

module.exports = router; 