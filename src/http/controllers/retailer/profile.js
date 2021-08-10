import { responseObject } from '../../../Helpers/common';
import {
  addRetailProjection,
  createRetailer,
} from '../../../services/retailer/profile';
import { HTTP_UNAUTHORIZED } from '../../../helpers/httpCodes';
import db from '../../../models';

// eslint-disable-next-line no-unused-vars
const BankInformation = db.BankInformation;

class RetailerController {}

RetailerController.createRetailer = async (req, res, next) => {
  const user = req.user;
  const accountInfo = req.body;

  if (!user)
    responseObject(
      res,
      HTTP_UNAUTHORIZED,
      'error',
      null,
      'Kindly login to access this resource'
    );

  const newAccount = await createRetailer(user, accountInfo);

  const { rCode, rState, rData, rMessage } = newAccount;

  return responseObject(res, rCode, rState, rData, rMessage);
};

RetailerController.addProjections = async (req, res, next) => {
  const user = req.user;
  const projectionDetails = req.body;

  if (!user)
    responseObject(
      res,
      HTTP_UNAUTHORIZED,
      'error',
      null,
      'Kindly login to access this resource'
    );

  const newProjection = await addRetailProjection(user, projectionDetails);

  const { rCode, rState, rData, rMessage } = newProjection;

  return responseObject(res, rCode, rState, rData, rMessage);
};

export default RetailerController;
