"use strict";
export default (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "Account",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      accountType: {
        type: DataTypes.ENUM("savings", "current"),
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "INR",
      },
      status: {
        type: DataTypes.ENUM("active", "locked", "closed"),
        allowNull: false,
        defaultValue: "active",
      },
    },
    {
      timestamps: true,
      tableName: "accounts",
    }
  );

  Account.associate = function (models) {
    Account.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Account.hasMany(models.Transaction, { foreignKey: "accountId", as: "transactions" });
  };

  return Account;
};
