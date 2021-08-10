'use strict';
const Joi = require('joi');
const { Model } = require('sequelize');
const { joiValidate } = require('../helpers/joi');
module.exports = (sequelize, DataTypes) => {
  class party extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }
  }
  party.init(
    {
      id: { type: DataTypes.INTEGER, allowNull: false },
      partyid: { type: DataTypes.INTEGER, allowNull: false },
      partyname: { type: DataTypes.STRING, allowNull: false }
    },
    {
      sequelize,
      modelName: 'party',
    }
  );

  // eslint-disable-next-line no-unused-vars
  party.validatePostData = async function (req, excludeId) {
    const schema = Joi.object({
      partyid: Joi.string().required().max(11),
      partyname: Joi.string().required().max(11)
      
    });

    return joiValidate(schema, req, true);
  };
  return party;
};
