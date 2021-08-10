'use strict';
const Joi = require('joi');
const { joiValidate } = require('../helpers/joi');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class polling_unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }

  polling_unit.init(
    {
      uniqueid: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      polling_unit_id: { type: DataTypes.INTEGER, allowNull: false },
      ward_id: { type: DataTypes.INTEGER, allowNull: true },
      lga_id: { type: DataTypes.INTEGER, allowNull: false },
      uniquewardid: { type: DataTypes.INTEGER, allowNull: false },
      polling_unit_number: { type: DataTypes.STRING, allowNull: false },
      polling_unit_name: { type: DataTypes.STRING, allowNull: false },
      polling_unit_description: { type: DataTypes.TEXT, allowNull: false },
      lat: { type: DataTypes.STRING, allowNull: false },
      long: { type: DataTypes.STRING, allowNull: false },
      entered_by_user: { type: DataTypes.STRING, allowNull: false },
      date_entered: { type: DataTypes.DATETIME, allowNull: false },
      user_ip_address: { type: DataTypes.STRING, allowNull: false }
    },
    {
      sequelize,
      modelName: 'polling_unit',
    }
  );

  polling_unit.validatePostData = async function (req, excludeId, data) {
    const schema = Joi.object({
      polling_unit_id: Joi.integer().required(),
      ward_id: Joi.integer().required().required,
      lga_id: Joi.integer().required().required,
      uniquewardid: Joi.integer(),
      polling_unit_number: Joi.string().max(50),
      polling_unit_name: Joi.string().max(50),
      polling_unit_description: Joi.string(),
      lat: Joi.string(),
      long: Joi.string(),
      entered_by_user: Joi.string().max(50),
      date_entered: Joi.date(),
      user_ip_address: Joi.string().max(50),
    });

    let validate = joiValidate(schema, req, true, data);
    return validate;
  };
  return polling_unit;
};
