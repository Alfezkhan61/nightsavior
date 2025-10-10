const Report = require('../models/Report');
const Shop = require('../models/Shop');

// @desc    Create report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  try {
    const { shopId, reason, description } = req.body;

    // Check if shop exists
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Check if user already reported this shop
    const existingReport = await Report.findOne({
      shopId,
      reporterId: req.user.id,
      status: { $in: ['pending', 'reviewed'] }
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this shop'
      });
    }

    const report = await Report.create({
      shopId,
      reporterId: req.user.id,
      reason,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: {
        report: {
          id: report._id,
          shopId: report.shopId,
          reason: report.reason,
          status: report.status,
          createdAt: report.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating report',
      error: error.message
    });
  }
};

// @desc    Get reports (admin)
// @route   GET /api/reports
// @access  Private (Admin only)
const getReports = async (req, res) => {
  try {
    const { status, reason, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (reason) {
      query.reason = reason;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reports = await Report.find(query)
      .populate('shopId', 'name category location')
      .populate('reporterId', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        reports: reports.map(report => ({
          id: report._id,
          shop: report.shopId,
          reporter: report.reporterId,
          reason: report.reason,
          description: report.description,
          status: report.status,
          adminNotes: report.adminNotes,
          reviewedBy: report.reviewedBy,
          reviewedAt: report.reviewedAt,
          createdAt: report.createdAt
        })),
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          hasNext: skip + reports.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving reports',
      error: error.message
    });
  }
};

// @desc    Update report status (admin)
// @route   PUT /api/reports/:id/status
// @access  Private (Admin only)
const updateReportStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.status = status;
    report.adminNotes = adminNotes;
    report.reviewedBy = req.user.id;
    report.reviewedAt = new Date();

    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report status updated successfully',
      data: {
        report: {
          id: report._id,
          status: report.status,
          adminNotes: report.adminNotes,
          reviewedBy: req.user.id,
          reviewedAt: report.reviewedAt
        }
      }
    });
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating report status',
      error: error.message
    });
  }
};

// @desc    Get user's reports
// @route   GET /api/reports/my-reports
// @access  Private
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporterId: req.user.id })
      .populate('shopId', 'name category location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        reports: reports.map(report => ({
          id: report._id,
          shop: report.shopId,
          reason: report.reason,
          description: report.description,
          status: report.status,
          adminNotes: report.adminNotes,
          createdAt: report.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get my reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving your reports',
      error: error.message
    });
  }
};

module.exports = {
  createReport,
  getReports,
  updateReportStatus,
  getMyReports
}; 