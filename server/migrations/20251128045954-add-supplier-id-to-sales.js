// migrations/YYYYMMDDHHmmss-add-supplier-to-sales.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Sales', 'supplierId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Enforce that every sale must identify the source
      references: {
        model: 'suppliers',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Sales', 'supplierId');
  }
};