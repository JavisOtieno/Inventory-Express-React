// server/models/Supplier.js
module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define('Supplier', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  }, {
    tableName: 'suppliers',
    timestamps: true,
  })

  Supplier.associate = (models) => {
  Supplier.hasMany(models.Purchase, { foreignKey: 'supplierId' });
};

  return Supplier
}