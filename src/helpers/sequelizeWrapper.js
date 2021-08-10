const { Sequelize, Op } = require('sequelize');
import _ from 'lodash';
import {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_BAD_REQUEST,
  HTTP_FORBIDDEN,
  HTTP_NOT_FOUND,
  HTTP_CONFLICT,
} from './httpCodes.js';
import { responseInfo } from './common.js';

/**
 * Used to create a single record for any given model
 * @param {class} Model - current model class
 * @param {object} data - the data to be updated
 * @param {object} extra - any additional configuration [where, exclude, entity]
 * @return {object}
 */
export const createRecord = async (Model, data, extra = {}) => {
  const {
    whereExtra = {},
    includeExtra = [],
    excludeExtra = [],
    entity = Model.name,
  } = extra;

  const result = await Model.create(data);
  if (result instanceof Model) {
    const id = result.id;
    //we can return result but it will contain unwanted attributes...so we fetch anew
    const where = sqlWhere(id, 'id', whereExtra);
    const attributes = sqlAttributes('', includeExtra, excludeExtra);

    const createdResult = await Model.findOne({
      attributes,
      where,
      // logging: console.log
    });

    return responseInfo(HTTP_CREATED, 'success', createdResult);
  } else {
    return responseInfo(
      HTTP_BAD_REQUEST,
      'error',
      null,
      `${entity} wasn't created!`
    );
  }
};

/**
 * generates the 'attributes' option of a model definition
 * @param {mixed} properties - columns to be SELECTed
 * @param {array} includeExtra - columns to include from SELECT
 * @param {array} excludeExtra - columns to exclude from SELECT
 * @return {array}
 */
const sqlAttributes = (properties, includeExtra = [], excludeExtra = []) => {
  let attributes = {};
  if (!_.isEmpty(includeExtra)) {
    attributes.include = includeExtra;
  }
  let exclude = ['createdAt', 'updatedAt', 'deletedAt'];
  if (!_.isEmpty(excludeExtra)) {
    attributes.exclude = [...exclude, ...excludeExtra];
  }
  if (!properties) return attributes;

  let propertiesArr = properties.split(',');
  if (propertiesArr.length) {
    //remove excludables, even if requested
    propertiesArr = propertiesArr.filter((field) => !exclude.includes(field));
    attributes = propertiesArr;
  }
  return attributes;
};

/**
 * generates the 'where' option of a model definition
 * @param {mixed} id - the value to be looked up
 * @param {string} by - the field to lookup the value
 * @param {object} whereExtra - additional where clause definitions
 * @return {object}
 */
const sqlWhere = (id, by, whereExtra = {}) => {
  let where = { [by]: id };
  if (!_.isEmpty(whereExtra)) {
    where = { ...where, ...whereExtra };
  }
  return where;
};
