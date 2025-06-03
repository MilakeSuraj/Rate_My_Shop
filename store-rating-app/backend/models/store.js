"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Store belongs to a user (owner)
      Store.belongsTo(models.User, { foreignKey: "userId", as: "owner" });
      // Store has many ratings
      Store.hasMany(models.Rating, { foreignKey: "storeId", as: "ratings" });
    }
  }
  Store.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      image: DataTypes.TEXT, // <-- Add this line
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
