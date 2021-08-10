'use strict';
const Joi = require('joi');
const { joiValidate } = require('../helpers/joi');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class lga extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  lga.init(
    {
      uniqueid: { type: DataTypes.STRING, allowNull: true },
      lga_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      lga_name: { type: DataTypes.STRING, allowNull: true },
      state_id: { type: DataTypes.INTEGER, allowNull: false },
      lga_description: { type: DataTypes.TEXT, allowNull: true },
      entered_by_user: { type: DataTypes.STRING, allowNull: false },
      date_entered: { type: DataTypes.DATETIME, allowNull: true },
      user_ip_address: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Farm',
    }
  );
  lga.validatePostData = async function (req, excludeId) {
    const schema = Joi.object({
      lga_id: Joi.integer().required().max(50),
      lga_name: Joi.string().required().max(4),
      state_id: Joi.integer().required(),
      lga_description: Joi.string().required().max(50),
      entered_by_user: Joi.string().required().max(50),
      date_entered: Joi.date().required(),
      user_ip_address: Joi.string().max(50),
    });

    return joiValidate(schema, req, true);
  };

  return lga;
};
