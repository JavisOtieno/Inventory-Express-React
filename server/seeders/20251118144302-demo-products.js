'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('products', [
      { name: 'Wireless Mouse', quantity: 45, createdAt: new Date(), updatedAt: new Date() },
      { name: 'USB-C Hub', quantity: 12, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Mechanical Keyboard', quantity: 8, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Webcam HD', quantity: 0, createdAt: new Date(), updatedAt: new Date() },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {})
  }
}