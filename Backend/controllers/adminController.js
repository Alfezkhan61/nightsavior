const Shop = require('../models/Shop');
const User = require('../models/User');
const Report = require('../models/Report');

// @desc    Get all shops (admin)
// @route   GET /api/admin/shops
// @access  Private (Admin only)
const getAllShops = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (status) {
      if (status === 'approved') query.isApproved = true;
      else if (status === 'pending') query.isApproved = false;
      else if (status === 'active') query.isActive = true;
      else if (status === 'inactive') query.isActive = false;
    }
    
    if (category) {
      query.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const shops = await Shop.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Shop.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        shops: shops.map(shop => ({
          id: shop._id,
          name: shop.name,
          category: shop.category,
          location: shop.location,
          openTime: shop.openTime,
          closeTime: shop.closeTime,
          isApproved: shop.isApproved,
          isActive: shop.isActive,
          owner: shop.ownerId,
          createdAt: shop.createdAt
        })),
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          hasNext: skip + shops.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all shops error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving shops',
      error: error.message
    });
  }
};

// @desc    Approve/reject shop
// @route   PUT /api/admin/shops/:id/approve
// @access  Private (Admin only)
// @desc    Toggle shop visibility (enable/disable)
// @route   PUT /api/admin/shops/:id/toggle
// @access  Private (Admin only)
const toggleShopStatus = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Toggle the active status instead of approval
    shop.isActive = !shop.isActive;
    await shop.save();

    const updatedShop = await Shop.findById(req.params.id).populate('ownerId', 'name email');

    res.status(200).json({
      success: true,
      message: `Shop ${shop.isActive ? 'enabled' : 'disabled'} successfully`,
      data: {
        shop: {
          id: updatedShop._id,
          name: updatedShop.name,
          isActive: updatedShop.isActive,
          updatedAt: updatedShop.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Toggle shop status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating shop status',
      error: error.message
    });
  }
};

// @desc    Delete shop
// @route   DELETE /api/admin/shops/:id
// @access  Private (Admin only)
const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    await Shop.findByIdAndDelete(req.params.id);

    // Also delete related reports
    await Report.deleteMany({ shopId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Shop deleted successfully'
    });
  } catch (error) {
    console.error('Delete shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting shop',
      error: error.message
    });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (status) {
      if (status === 'active') query.isActive = true;
      else if (status === 'inactive') query.isActive = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        })),
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          hasNext: skip + users.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
};

// @desc    Toggle user status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin only)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalShops,
      approvedShops,
      pendingShops,
      totalUsers,
      totalReports,
      pendingReports
    ] = await Promise.all([
      Shop.countDocuments(),
      Shop.countDocuments({ isApproved: true }),
      Shop.countDocuments({ isApproved: false }),
      User.countDocuments(),
      Report.countDocuments(),
      Report.countDocuments({ status: 'pending' })
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalShops,
          approvedShops,
          pendingShops,
          totalUsers,
          totalReports,
          pendingReports
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard stats',
      error: error.message
    });
  }
};

module.exports = {
  getAllShops,
  toggleShopStatus,
  deleteShop,
  getAllUsers,
  toggleUserStatus,
  getDashboardStats
}; 