import {
  confirmEmail,
  createUser,
  forgotPassword,
  loginUser,
  resetPassword,
} from '../../../services/auth';
import db from '../../../models';
import { errorObject, responseObject } from '../../../Helpers/common';
import { getRole } from '../../../services/utils';
import { ROLE_CUSTOMER, ROLE_RETAILER } from '../../../Helpers/constants';

const User = db.User;

class AuthController {}

//= =======================================
// Login Route
//= =======================================
AuthController.login = async function (req, res, next) {
  const { email, password } = req.body;
  try {
    const loggedInUser = await loginUser(email, password);
    const { rCode, rState, rData, rMessage } = loggedInUser;

    return responseObject(res, rCode, rState, rData, rMessage);
  } catch (err) {
    if (err) {
      return errorObject(res, 500, JSON.parse(err.message));
    }
  }
};

//= =======================================
// Registration Route
//= =======================================
AuthController.registerUser = async function (req, res, next) {
  //   validate payload
  const validate = await User.validatePostData(req);
  if (validate !== true) {
    const { rCode, rState, rMessage } = validate;
    return responseObject(res, rCode, rState, null, rMessage);
  }

  const { firstName, lastName, email, password, phone, userType } = req.body;
  const userT = userType.toLowerCase();

  let role;
  switch (userT) {
    case 'farmer':
      role = getRole(ROLE_CUSTOMER);
    case 'retailer':
      role = getRole(ROLE_RETAILER);
    default:
      role = getRole(ROLE_RETAILER);
  }
  const reqData = { firstName, lastName, email, password, phone, roles: role };

  try {
    const user = await createUser(reqData);
    const { rCode, rState, rData, rMessage } = user;

    return responseObject(res, rCode, rState, rData, rMessage);
  } catch (err) {
    /**
     * @TODO log error to server and send a server error message to client
     */
    console.log(err);
  }
};

//= =======================================
// Confirm Email
//= =======================================
AuthController.confirmEmail = async function (req, res, next) {
  const { token } = req.params;

  try {
    const confirmedEmail = await confirmEmail(token);

    const { rCode, rState, rData, rMessage } = confirmedEmail;

    return responseObject(res, rCode, rState, rData, rMessage);
  } catch (err) {
    /**
     * @TODO log error to server and send a server error message to client
     */
    console.log(err);
  }
};

//= =======================================
// Authorization Middleware
//= =======================================

// Role authorization check
// eslint-disable-next-line no-unused-vars
AuthController.roleAuthorization = function (requiredRole) {
  // req, res, next
  return function (req) {
    // eslint-disable-next-line no-unused-vars
    const { user } = req;

    // Find user, Confirm Role and move to next request
  };
};

//= =======================================
// Forgot Password
//= =======================================
AuthController.forgotPassword = async function (req, res, next) {
  const { email } = req.body;

  try {
    const requestPasswordReset = await forgotPassword(email);

    const { rCode, rState, rData, rMessage } = requestPasswordReset;

    return responseObject(res, rCode, rState, rData, rMessage);
  } catch (err) {
    /**
     * @TODO log error to server and send a server error message to client
     */
    console.log(err);
  }
};

//= =======================================
// Reset Password
//= =======================================
AuthController.resetPassword = async function (req, res, next) {
  const { newPassword } = req.body;
  const { token } = req.params;

  try {
    const resetPword = await resetPassword(token, newPassword);

    const { rCode, rState, rData, rMessage } = resetPword;

    return responseObject(res, rCode, rState, rData, rMessage);
  } catch (err) {
    /**
     * @TODO log error to server and send a server error message to client
     */
    console.log(err);
  }
};

export default AuthController;
