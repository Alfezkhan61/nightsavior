const mongoose = require('mongoose');
const User = require('../models/User');
const Shop = require('../models/Shop');
require('dotenv').config({ path: './config.env' });

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@nightmate.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Poster',
    email: 'john@nightmate.com',
    password: 'poster123',
    role: 'poster'
  },
  {
    name: 'Sarah User',
    email: 'sarah@nightmate.com',
    password: 'user123',
    role: 'user'
  }
];

const shops = [
  {
    name: 'Late Night Pizza',
    category: 'food',
    location: {
      address: '123 Main Street',
      city: 'New York',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    openTime: '18:00',
    closeTime: '02:00',
    description: 'Best pizza in town, open late for night owls',
    phone: '+1234567890',
    isApproved: true
  },
  {
    name: '24/7 Pharmacy',
    category: 'medical',
    location: {
      address: '456 Health Avenue',
      city: 'New York',
      coordinates: {
        lat: 40.7589,
        lng: -73.9851
      }
    },
    openTime: '00:00',
    closeTime: '23:59',
    description: 'Round the clock pharmacy services',
    phone: '+1234567891',
    isApproved: true
  },
  {
    name: 'Night Owl Convenience',
    category: 'other',
    location: {
      address: '789 Night Street',
      city: 'New York',
      coordinates: {
        lat: 40.7505,
        lng: -73.9934
      }
    },
    openTime: '20:00',
    closeTime: '06:00',
    description: 'Convenience store for late night essentials',
    phone: '+1234567892',
    isApproved: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Shop.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log('👥 Created users:', createdUsers.length);

    // Create shops with owner IDs
    const shopOwner = createdUsers.find(user => user.role === 'poster');
    const shopsWithOwner = shops.map(shop => ({
      ...shop,
      ownerId: shopOwner._id
    }));

    const createdShops = await Shop.create(shopsWithOwner);
    console.log('🏪 Created shops:', createdShops.length);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@nightmate.com / admin123');
    console.log('Poster: john@nightmate.com / poster123');
    console.log('User: sarah@nightmate.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase }; 