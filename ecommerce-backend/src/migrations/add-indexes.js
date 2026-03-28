import sequelize from '../config/database.js';

async function addIndexes() {
  const queryInterface = sequelize.getQueryInterface();
  
  try {
    // Add index for category searches
    await queryInterface.addIndex('products', ['category'], {
      name: 'products_category_idx'
    });
    
    // Add index for name searches (used in iLike queries)
    await queryInterface.addIndex('products', ['name'], {
      name: 'products_name_idx'
    });
    
    // Add index for featured products
    await queryInterface.addIndex('products', ['is_featured', 'is_active'], {
      name: 'products_featured_idx'
    });
    
    // Add index for exclusive products
    await queryInterface.addIndex('products', ['is_exclusive', 'is_active'], {
      name: 'products_exclusive_idx'
    });
    
    // Add index for google_id in users table
    await queryInterface.addIndex('users', ['google_id'], {
      name: 'users_google_id_idx'
    });
    
    console.log('✅ Indexes added successfully');
  } catch (error) {
    console.error('❌ Error adding indexes:', error);
  }
}

// Run the function
addIndexes();