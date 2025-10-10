const express = require('express');
const router = express.Router();

// Import controllers
const {
  createReport,
  getReports,
  updateReportStatus,
  getMyReports
} = require('../controllers/reportController');

// Import middleware
const { protect, isAdmin } = require('../middleware/auth');
const { validateReport } = require('../middleware/validate');

// Public routes (none for reports)

// Protected routes
router.use(protect); // Apply authentication to all routes below

router.post('/', validateReport, createReport);
router.get('/my-reports', getMyReports);

// Admin only routes
router.get('/', isAdmin, getReports);
router.put('/:id/status', isAdmin, updateReportStatus);

module.exports = router; 