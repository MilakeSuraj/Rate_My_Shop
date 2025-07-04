"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User can own many stores
      User.hasMany(models.Store, { foreignKey: "userId", as: "stores" });
      // User can have many ratings
      User.hasMany(models.Rating, { foreignKey: "userId", as: "ratings" });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      address: DataTypes.STRING,
      role: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: "approved",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
