'use strict';
const Joi = require('joi');
const { joiValidate } = require('../helpers/joi');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class agentname extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {}
  }

  agentname.init(
    {
      name_id: { type: DataTypes.INTEGER, allowNull: false },
      firstname: { type: DataTypes.STRING, default: 'Nigeria' },
      lastname: { type: DataTypes.INTEGER, allowNull: false },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
        allowNull: true,
        defaultValue: null
      },
      phone: { type: DataTypes.STRING, allowNull: false },
      pollingunit_uniqueid: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'agentname',
    }
  );

  agentname.validatePostData = async function (req) {
    const schema = Joi.object({
      firstname: Joi.string().required().max(255),
      lastname: Joi.string().required().max(255),
      email: Joi.string().max(255),
      phone: Joi.string().required().max(13),
      pollingunit_uniqueid: Joi.integer().required()
    });

    return joiValidate(schema, req, true);
  };
  return agentname;
};
