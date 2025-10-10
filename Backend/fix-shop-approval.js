// Fix existing shops that aren't approved
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/nightmate')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return fixShopApproval();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

async function fixShopApproval() {
  try {
    const Shop = require('./models/Shop');

    console.log('\n🔧 FIXING SHOP APPROVAL STATUS');
    console.log('==============================');

    // Find all shops that are not approved
    const unapprovedShops = await Shop.find({ isApproved: false });
    console.log(`Found ${unapprovedShops.length} unapproved shops`);

    if (unapprovedShops.length > 0) {
      // Update all shops to be approved
      const result = await Shop.updateMany(
        { isApproved: false }, 
        { isApproved: true }
      );
      
      console.log(`✅ Updated ${result.modifiedCount} shops to be approved`);
      
      // Verify the fix
      const stillUnapproved = await Shop.countDocuments({ isApproved: false });
      console.log(`Remaining unapproved shops: ${stillUnapproved}`);
      
      if (stillUnapproved === 0) {
        console.log('🎉 All shops are now approved and visible to users!');
      }
    } else {
      console.log('✅ All shops are already approved');
    }

    // Show current shop status
    const totalShops = await Shop.countDocuments({});
    const approvedShops = await Shop.countDocuments({ isApproved: true });
    const activeShops = await Shop.countDocuments({ isActive: true });
    const visibleShops = await Shop.countDocuments({ isActive: true, isApproved: true });

    console.log('\n📊 FINAL SHOP STATUS:');
    console.log(`Total shops: ${totalShops}`);
    console.log(`Approved shops: ${approvedShops}`);
    console.log(`Active shops: ${activeShops}`);
    console.log(`Visible to users: ${visibleShops}`);

    await mongoose.disconnect();
    console.log('\n✅ Fix complete - shops should now be visible to all users');
    
  } catch (error) {
    console.error('❌ Error fixing shop approval:', error);
    await mongoose.disconnect();
  }
}
