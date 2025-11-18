// server/models/Product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'products',
    timestamps: true,           // gives you createdAt & updatedAt
  })

  Product.associate = (models) => {
  Product.hasMany(models.Purchase, { foreignKey: 'productId' });
};

  Product.associate = (models) => {
  Product.hasMany(models.Sale, { foreignKey: 'productId' });
};

  return Product
}