'use strict';
const Joi = require('joi');
const { joiValidate } = require('../helpers/joi');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class states extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }

  states.init(
    {
      state_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      state_name: { type: DataTypes.STRING, allowNull: false }
    },
    {
      sequelize,
      modelName: 'states',
    }
  );

  states.validatePostData = async function (req, excludeId, data) {
    const schema = Joi.object({
      state_name: Joi.string().required().max(50)
    });

    return joiValidate(schema, req, true, data);
  };
  return states;
};
