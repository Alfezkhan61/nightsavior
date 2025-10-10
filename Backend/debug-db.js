// MongoDB Direct Query Script
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nightmate')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return checkShops();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

async function checkShops() {
  try {
    // Import Shop model
    const Shop = require('./models/Shop');
    const User = require('./models/User');

    console.log('\n🔍 ANALYZING SHOP VISIBILITY ISSUE');
    console.log('=====================================');

    // 1. Check total shops in database
    const totalShops = await Shop.countDocuments({});
    console.log(`\n1. Total shops in database: ${totalShops}`);

    if (totalShops === 0) {
      console.log('❌ NO SHOPS FOUND - This is why users can\'t see any shops!');
      console.log('Solution: Users need to create shops first.');
      await mongoose.disconnect();
      return;
    }

    // 2. Check approved shops
    const approvedShops = await Shop.countDocuments({ isApproved: true });
    console.log(`2. Approved shops: ${approvedShops}/${totalShops}`);

    // 3. Check active shops
    const activeShops = await Shop.countDocuments({ isActive: true });
    console.log(`3. Active shops: ${activeShops}/${totalShops}`);

    // 4. Check shops that meet public criteria
    const publicShops = await Shop.countDocuments({ 
      isActive: true, 
      isApproved: true 
    });
    console.log(`4. Publicly visible shops: ${publicShops}/${totalShops}`);

    // 5. Get all shops with details
    const allShops = await Shop.find({}).populate('ownerId', 'name email');
    
    console.log('\n📋 DETAILED SHOP ANALYSIS:');
    console.log('==========================');
    
    allShops.forEach((shop, index) => {
      console.log(`\nShop ${index + 1}: ${shop.name}`);
      console.log(`  - Category: ${shop.category}`);
      console.log(`  - Owner: ${shop.ownerId ? shop.ownerId.name : 'Unknown'} (${shop.ownerId ? shop.ownerId.email : 'No email'})`);
      console.log(`  - Active: ${shop.isActive}`);
      console.log(`  - Approved: ${shop.isApproved}`);
      console.log(`  - Open Time: ${shop.openTime}`);
      console.log(`  - Close Time: ${shop.closeTime}`);
      console.log(`  - Address: ${shop.location.address}, ${shop.location.city}`);
      console.log(`  - Created: ${shop.createdAt}`);
      
      // Check if shop should be visible to users
      const shouldBeVisible = shop.isActive && shop.isApproved;
      console.log(`  - Should be visible to users: ${shouldBeVisible ? '✅ YES' : '❌ NO'}`);
      
      if (!shouldBeVisible) {
        const reasons = [];
        if (!shop.isActive) reasons.push('not active');
        if (!shop.isApproved) reasons.push('not approved');
        console.log(`  - Hidden because: ${reasons.join(', ')}`);
      }
    });

    // 6. Simulate the getOpenShops query
    console.log('\n🕒 CHECKING CURRENT TIME FILTERING:');
    console.log('===================================');
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    console.log(`Current time: ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} (${currentTime} minutes)`);

    const visibleShops = allShops.filter(shop => {
      if (!shop.isActive || !shop.isApproved) return false;
      
      const [openHour, openMin] = shop.openTime.split(':').map(Number);
      const [closeHour, closeMin] = shop.closeTime.split(':').map(Number);
      
      const openMinutes = openHour * 60 + openMin;
      const closeMinutes = closeHour * 60 + closeMin;
      
      let isOpen;
      // Handle shops that are open past midnight
      if (closeMinutes < openMinutes) {
        isOpen = currentTime >= openMinutes || currentTime <= closeMinutes;
      } else {
        isOpen = currentTime >= openMinutes && currentTime <= closeMinutes;
      }
      
      console.log(`  ${shop.name}: ${shop.openTime}-${shop.closeTime} → ${isOpen ? 'OPEN' : 'CLOSED'}`);
      return isOpen;
    });

    console.log(`\n🎯 FINAL RESULT: ${visibleShops.length} shops should be visible to users right now`);
    
    if (visibleShops.length === 0) {
      console.log('\n❌ NO SHOPS VISIBLE - Possible reasons:');
      console.log('   1. No shops created yet');
      console.log('   2. All shops are inactive (isActive: false)');
      console.log('   3. All shops are unapproved (isApproved: false)');
      console.log('   4. All shops are currently closed based on time');
      console.log('   5. Time format issues in openTime/closeTime');
    } else {
      console.log('\n✅ These shops should be visible:');
      visibleShops.forEach(shop => {
        console.log(`   - ${shop.name} (${shop.category})`);
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ Analysis complete');
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
    await mongoose.disconnect();
  }
}
