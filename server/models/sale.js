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
  }
})

Sale.associate = (models) => {
  Sale.belongsTo(models.Customer, { foreignKey: 'customerId' });
  Sale.belongsTo(models.Product, { foreignKey: 'productId' });
};

  return Sale
}