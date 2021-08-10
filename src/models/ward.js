'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ward extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  ward.init(
    {
      uniqueid: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      ward_id: { type: DataTypes.INTEGER, allowNull: true },
      ward_name: { type: DataTypes.STRING, allowNull: false },
      lga_id: { type: DataTypes.INTEGER, allowNull: false },
      ward_description: { type: DataTypes.TEXT, allowNull: false },
      entered_by_user: { type: DataTypes.STRING, allowNull: false },
      date_entered: { type: DataTypes.DATETIME, allowNull: false },
      user_ip_address: { type: DataTypes.STRING, allowNull: false }
    },
    {
      sequelize,
      modelName: 'ward',
    }
  );
  ward.validatePostData = async function (req, excludeId, data) {
    const schema = Joi.object({
      ward_id: Joi.integer().required(),
      ward_name: Joi.string().required().max(50),
      lga_id: Joi.integer().required(),
      ward_description: Joi.text(),
      entered_by_user: Joi.string().max(50),
      date_entered: Joi.date(),
      user_ip_address: Joi.string().max(50),
    });

    return joiValidate(schema, req, true, data);
  };

  return ward;
};
