const mongoose = require('mongoose');

// Model for storing preferences of non-authenticated users
const userPreferencesSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
    unique: true,
    index: true
  },
  themePreference: {
    type: String,
    enum: ['dark', 'light'],
    default: 'dark'
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    index: { expireAfterSeconds: 0 } // TTL index for automatic cleanup
  }
}, {
  timestamps: true
});

// Update lastAccessed on each access
userPreferencesSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.lastAccessed = new Date();
  }
  next();
});

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
