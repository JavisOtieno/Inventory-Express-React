// server/models/Sale.js
module.exports = (sequelize, DataTypes) => {

const Sale = sequelize.define('Sale', {
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false
},
})

// Add this inside the define block



// Update associations
Sale.associate = (models) => {
  Sale.belongsTo(models.Customer, { foreignKey: 'customerId' });
  Sale.belongsTo(models.Product, { foreignKey: 'productId' });
  Sale.belongsTo(models.Supplier, { foreignKey: 'supplierId' }); // New Association
};

  return Sale
}