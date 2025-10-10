const express = require('express');
const router = express.Router();

// Import controllers
const {
  updateUserThemePreference,
  getUserThemePreference,
  updateGuestThemePreference,
  getGuestThemePreference
} = require('../controllers/themeController');

// Import middleware
const { protect } = require('../middleware/auth');

// Public routes for guest users
router.post('/guest-preference', getGuestThemePreference);
router.put('/guest-preference', updateGuestThemePreference);

// Protected routes for authenticated users
router.use(protect); // Apply authentication to routes below

router.get('/preference', getUserThemePreference);
router.put('/preference', updateUserThemePreference);

module.exports = router;
