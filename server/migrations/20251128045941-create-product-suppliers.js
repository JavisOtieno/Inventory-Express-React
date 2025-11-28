// migrations/YYYYMMDDHHmmss-create-product-supplier.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_suppliers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products', // Must match exact table name of Products
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      supplierId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'suppliers', // Must match exact table name of Suppliers
          key: 'id'
        },
        onDelete: 'CASCADE', // If supplier is deleted, their stock records go too
        onUpdate: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Optional: Add a unique constraint so you can't have two rows for the same Product+Supplier combo
    await queryInterface.addConstraint('product_suppliers', {
      fields: ['productId', 'supplierId'],
      type: 'unique',
      name: 'unique_product_supplier_stock'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_suppliers');
  }
};