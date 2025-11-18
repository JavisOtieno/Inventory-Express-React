// server/models/Purchase.js
module.exports = (sequelize, DataTypes) => {

const Purchase = sequelize.define('Purchase', {
  supplierId: {
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

Purchase.associate = (models) => {
  Purchase.belongsTo(models.Supplier, { foreignKey: 'supplierId' });
  Purchase.belongsTo(models.Product, { foreignKey: 'productId' });
};

  return Purchase
}