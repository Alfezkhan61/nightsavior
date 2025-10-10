const Shop = require('../models/Shop');
const User = require('../models/User');

// @desc    Create new shop
// @route   POST /api/shops
// @access  Private (Poster only)
const createShop = async (req, res) => {
  try {
    const shopData = {
      ...req.body,
      ownerId: req.user.id,
      isApproved: true  // Auto-approve all new shops
    };

    const shop = await Shop.create(shopData);

    res.status(201).json({
      success: true,
      message: 'Shop created and published successfully',
      data: {
        shop: {
          id: shop._id,
          name: shop.name,
          category: shop.category,
          location: shop.location,
          openTime: shop.openTime,
          closeTime: shop.closeTime,
          isApproved: shop.isApproved,
          createdAt: shop.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Create shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating shop',
      error: error.message
    });
  }
};

// @desc    Get shops currently open
// @route   GET /api/shops/open-now
// @access  Public
const getOpenShops = async (req, res) => {
  try {
    const { category, city, limit = 50, page = 1 } = req.query;
    
    // Build query
    const query = {
      isActive: true,
      isApproved: true
    };

    if (category) {
      query.category = category;
    }

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const shops = await Shop.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Filter shops that are currently open
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const openShops = shops.filter(shop => {
      const [openHour, openMin] = shop.openTime.split(':').map(Number);
      const [closeHour, closeMin] = shop.closeTime.split(':').map(Number);
      
      const openMinutes = openHour * 60 + openMin;
      const closeMinutes = closeHour * 60 + closeMin;
      
      // Handle shops that are open past midnight
      if (closeMinutes < openMinutes) {
        return currentTime >= openMinutes || currentTime <= closeMinutes;
      }
      
      return currentTime >= openMinutes && currentTime <= closeMinutes;
    });

    // Get total count for pagination
    const total = await Shop.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Open shops retrieved successfully',
      data: {
        shops: openShops.map(shop => ({
          id: shop._id,
          name: shop.name,
          category: shop.category,
          location: shop.location,
          openTime: shop.openTime,
          closeTime: shop.closeTime,
          description: shop.description,
          phone: shop.phone,
          rating: shop.rating,
          reviewCount: shop.reviewCount,
          owner: shop.ownerId,
          isOpenNow: true
        })),
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          hasNext: skip + openShops.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get open shops error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving open shops',
      error: error.message
    });
  }
};

// @desc    Get shop by ID
// @route   GET /api/shops/:id
// @access  Public
const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('ownerId', 'name email');

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        shop: {
          id: shop._id,
          name: shop.name,
          category: shop.category,
          location: shop.location,
          openTime: shop.openTime,
          closeTime: shop.closeTime,
          description: shop.description,
          phone: shop.phone,
          rating: shop.rating,
          reviewCount: shop.reviewCount,
          owner: shop.ownerId,
          isOpenNow: shop.isOpenNow,
          isApproved: shop.isApproved,
          createdAt: shop.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get shop by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving shop',
      error: error.message
    });
  }
};

// @desc    Update shop
// @route   PUT /api/shops/:id
// @access  Private (Owner only)
const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Check if user is the owner
    if (shop.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this shop'
      });
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('ownerId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Shop updated successfully',
      data: {
        shop: {
          id: updatedShop._id,
          name: updatedShop.name,
          category: updatedShop.category,
          location: updatedShop.location,
          openTime: updatedShop.openTime,
          closeTime: updatedShop.closeTime,
          description: updatedShop.description,
          phone: updatedShop.phone,
          isApproved: updatedShop.isApproved,
          updatedAt: updatedShop.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Update shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating shop',
      error: error.message
    });
  }
};

// @desc    Get user's shops
// @route   GET /api/shops/my-shops
// @access  Private
const getMyShops = async (req, res) => {
  try {
    const shops = await Shop.find({ ownerId: req.user.id })
      .sort({ createdAt: -1 });

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
          createdAt: shop.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get my shops error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving your shops',
      error: error.message
    });
  }
};

module.exports = {
  createShop,
  getOpenShops,
  getShopById,
  updateShop,
  getMyShops
}; 