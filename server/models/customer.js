// server/models/Customer.js
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
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
    tableName: 'customers',
    timestamps: true,
  })
    Customer.associate = (models) => {
  Customer.hasMany(models.Sale, { foreignKey: 'customerId' });
};

  return Customer
}