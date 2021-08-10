import { responseObject } from '../../../Helpers/common';
import {
  addBankInfo,
  addFarmProjection,
  createFarmer,
} from '../../../services/farmer/profile';
import { HTTP_UNAUTHORIZED } from '../../../helpers/httpCodes';
import db from '../../../models';

// eslint-disable-next-line no-unused-vars
const BankInformation = db.BankInformation;
const Farm = db.Farm;

class FarmersController {}

FarmersController.createFarmerAccount = async (req, res, next) => {
  //   validate payload
  // const validate = await BankInformation.validatePostData(
  //   req,
  //   null,
  //   req.body.bankInformation
  // );
  // if (validate !== true) {
  //   const { rCode, rState, rMessage } = validate;
  //   return responseObject(res, rCode, rState, null, rMessage);
  // }

  // let validateFarms;
  // for (let farm of req.body.farms) {
  //   console.log('validate', farm);
  //   validateFarms = await Farm.validatePostData(req, null, farm);
  // }

  // if (validateFarms !== true) {
  //   const { rCode, rState, rMessage } = validateFarms;
  //   return responseObject(res, rCode, rState, null, rMessage);
  // }

  const user = req.user;
  const farmInfo = req.body;

  if (!user)
    responseObject(
      res,
      HTTP_UNAUTHORIZED,
      'error',
      null,
      'Kindly login to access this resource'
    );

  const newAccount = await createFarmer(user, farmInfo);

  const { rCode, rState, rData, rMessage } = newAccount;

  return responseObject(res, rCode, rState, rData, rMessage);
};

FarmersController.addFarmProjection = async (req, res, next) => {
  const user = req.user;
  const projectionInfo = req.body;

  if (!user)
    responseObject(
      res,
      HTTP_UNAUTHORIZED,
      'error',
      null,
      'Kindly login to access this resource'
    );

  const newAccount = await addFarmProjection(user, projectionInfo);

  const { rCode, rState, rData, rMessage } = newAccount;

  return responseObject(res, rCode, rState, rData, rMessage);
};

FarmersController.addBankInformation = async (req, res, next) => {
  const user = req.user;
  const bankInfo = req.body;

  if (!user)
    responseObject(
      res,
      HTTP_UNAUTHORIZED,
      'error',
      null,
      'Kindly login to access this resource'
    );

  const newAccount = await addBankInfo(user, bankInfo);

  const { rCode, rState, rData, rMessage } = newAccount;

  return responseObject(res, rCode, rState, rData, rMessage);
};

export default FarmersController;
