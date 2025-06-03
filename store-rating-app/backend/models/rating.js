"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Rating belongs to a user
      Rating.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      // Rating belongs to a store
      Rating.belongsTo(models.Store, { foreignKey: "storeId", as: "store" });
    }
  }
  Rating.init(
    {
      rating: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      storeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Rating",
    }
  );
  return Rating;
};
