import sequelize from '../config/database.js';

async function addPaymentColumns() {
  const queryInterface = sequelize.getQueryInterface();
  
  try {
    // Check if the column already exists
    const tableInfo = await queryInterface.describeTable('payments');
    
    // Add mollie_payment_id if it doesn't exist
    if (!tableInfo.mollie_payment_id) {
      await queryInterface.addColumn('payments', 'mollie_payment_id', {
        type: sequelize.Sequelize.STRING,
        allowNull: false,
        unique: true
      });
      console.log('✅ Added mollie_payment_id column to payments table');
    }
    
    // Add other columns if needed
    if (!tableInfo.payment_method) {
      await queryInterface.addColumn('payments', 'payment_method', {
        type: sequelize.Sequelize.STRING,
        allowNull: true
      });
      console.log('✅ Added payment_method column to payments table');
    }
    
    console.log('✅ Payment table migration completed');
  } catch (error) {
    console.error('❌ Payment table migration failed:', error);
  }
}

// Run the migration
addPaymentColumns()
  .then(() => {
    console.log('Migration completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });