const User = require('../models/User');
const UserPreferences = require('../models/UserPreferences');
const crypto = require('crypto');

// Generate a session ID for non-authenticated users
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

// @desc    Update theme preference for authenticated users
// @route   PUT /api/theme/preference
// @access  Private
const updateUserThemePreference = async (req, res) => {
  try {
    const { themePreference } = req.body;

    // Validate theme preference
    if (!themePreference || !['dark', 'light'].includes(themePreference)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid theme preference. Must be "dark" or "light"'
      });
    }

    // Update user's theme preference
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { themePreference },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Theme preference updated successfully',
      data: {
        themePreference: user.themePreference
      }
    });
  } catch (error) {
    console.error('Update user theme preference error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating theme preference',
      error: error.message
    });
  }
};

// @desc    Get theme preference for authenticated users
// @route   GET /api/theme/preference
// @access  Private
const getUserThemePreference = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        themePreference: user.themePreference
      }
    });
  } catch (error) {
    console.error('Get user theme preference error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving theme preference',
      error: error.message
    });
  }
};

// @desc    Update theme preference for guest users (non-authenticated)
// @route   PUT /api/theme/guest-preference
// @access  Public
const updateGuestThemePreference = async (req, res) => {
  try {
    const { themePreference, sessionId } = req.body;

    // Validate theme preference
    if (!themePreference || !['dark', 'light'].includes(themePreference)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid theme preference. Must be "dark" or "light"'
      });
    }

    let currentSessionId = sessionId;

    // Generate session ID if not provided
    if (!currentSessionId) {
      currentSessionId = generateSessionId();
    }

    // Get client info for tracking
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Update or create guest preferences
    const preferences = await UserPreferences.findOneAndUpdate(
      { sessionId: currentSessionId },
      { 
        themePreference,
        ipAddress,
        userAgent,
        lastAccessed: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      { 
        new: true, 
        upsert: true, 
        runValidators: true 
      }
    );

    res.status(200).json({
      success: true,
      message: 'Guest theme preference updated successfully',
      data: {
        sessionId: preferences.sessionId,
        themePreference: preferences.themePreference
      }
    });
  } catch (error) {
    console.error('Update guest theme preference error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating guest theme preference',
      error: error.message
    });
  }
};

// @desc    Get theme preference for guest users (non-authenticated)
// @route   POST /api/theme/guest-preference
// @access  Public
const getGuestThemePreference = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      // Return default theme and new session ID
      const newSessionId = generateSessionId();
      return res.status(200).json({
        success: true,
        data: {
          sessionId: newSessionId,
          themePreference: 'dark' // Default theme
        }
      });
    }

    // Find existing preferences
    const preferences = await UserPreferences.findOne({ sessionId });

    if (!preferences) {
      // Session not found, return default
      return res.status(200).json({
        success: true,
        data: {
          sessionId,
          themePreference: 'dark' // Default theme
        }
      });
    }

    // Update last accessed time
    preferences.lastAccessed = new Date();
    await preferences.save();

    res.status(200).json({
      success: true,
      data: {
        sessionId: preferences.sessionId,
        themePreference: preferences.themePreference
      }
    });
  } catch (error) {
    console.error('Get guest theme preference error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving guest theme preference',
      error: error.message
    });
  }
};

module.exports = {
  updateUserThemePreference,
  getUserThemePreference,
  updateGuestThemePreference,
  getGuestThemePreference
};
