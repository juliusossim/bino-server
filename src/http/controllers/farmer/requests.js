import { responseObject } from '../../../Helpers/common';
import { HTTP_UNAUTHORIZED } from '../../../helpers/httpCodes';
import db from '../../../models';
import {
  generateCollectionRequest,
  getFarmersCollectionRequests,
} from '../../../services/farmer/requests';

// eslint-disable-next-line no-unused-vars
const BankInformation = db.BankInformation;
const Farm = db.Farm;

class FarmersRequestsController {}

FarmersRequestsController.generateCollectionRequest = async (
  req,
  res,
  next
) => {
  const user = req.user;
  const requestDetails = req.body;

  if (!user)
    responseObject(
      res,
      HTTP_UNAUTHORIZED,
      'error',
      null,
      'Kindly login to access this resource'
    );

  const newRequest = await generateCollectionRequest(user, requestDetails);

  const { rCode, rState, rData, rMessage } = newRequest;

  return responseObject(res, rCode, rState, rData, rMessage);
};

FarmersRequestsController.getFarmersCollectionRequestsHistory = async (
  req,
  res,
  next
) => {
  const user = req.user;

  if (!user)
    responseObject(
      res,
      HTTP_UNAUTHORIZED,
      'error',
      null,
      'Kindly login to access this resource'
    );

  const newRequest = await getFarmersCollectionRequests(user);

  const { rCode, rState, rData, rMessage } = newRequest;

  return responseObject(res, rCode, rState, rData, rMessage);
};

export default FarmersRequestsController;
