'use strict';
const Joi = require('joi');
const { joiValidate } = require('../helpers/joi');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class announced_laga_results extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  announced_laga_results.init(
    {
      result_id: { type: DataTypes.INTEGER, allowNull: false },
      lga_name: { type: DataTypes.STRING,  allowNull: false },
      party_abbreviation: { type: DataTypes.STRING, allowNull: false },
      party_score: { type: DataTypes.INTEGER, allowNull: false },
      entered_by_user: { type: DataTypes.STRING, allowNull: false },
      date_entered: { type: DataTypes.DATETIME, allowNull: true },
      user_ip_address: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'announced_laga_results',
    }
  );

  announced_laga_results.validatePostData = async function (req, excludeId) {
    const schema = Joi.object({
      lga_name: Joi.string()
        .required().max(50),
      party_abbreviation: Joi.string().required().max(4),
      party_score: Joi.integer().required(),
      entered_by_user: Joi.string().required().max(50),
      date_entered: Joi.date().required(),
      user_ip_address: Joi.string().max(50),
    });

    return joiValidate(schema, req, true);
  };
  return announced_laga_results;
};
