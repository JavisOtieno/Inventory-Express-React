module.exports = (sequelize, DataTypes) => {
  const ProductSupplier = sequelize.define('ProductSupplier', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'suppliers',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'product_suppliers',
    timestamps: true,
  })

  ProductSupplier.associate = (models) => {
    ProductSupplier.belongsTo(models.Product, { foreignKey: 'productId' });
    ProductSupplier.belongsTo(models.Supplier, { foreignKey: 'supplierId' });
  };

  return ProductSupplier
}