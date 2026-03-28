import sequelize from '../config/database.js';

async function fixShippingAddressColumn() {
  try {
    // Get the raw query interface
    const queryInterface = sequelize.getQueryInterface();
    
    // Check if the column exists
    const tableInfo = await queryInterface.describeTable('orders');
    
    if (tableInfo.shipping_address) {
      // Execute raw SQL with USING clause to properly convert data
      await sequelize.query(`
        ALTER TABLE "orders" 
        ALTER COLUMN "shipping_address" TYPE JSON 
        USING CASE 
          WHEN shipping_address IS NULL THEN NULL
          WHEN shipping_address = '' THEN '{}'::json
          ELSE shipping_address::json
        END
      `);
      console.log('✅ Successfully converted shipping_address column to JSON type');
    } else {
      console.log('Column shipping_address does not exist in orders table');
    }
    
  } catch (error) {
    console.error('❌ Error fixing shipping_address column:', error);
  }
}

// Run the migration
fixShippingAddressColumn()
  .then(() => {
    console.log('Migration completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });