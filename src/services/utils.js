import {
  ROLE_ADMIN,
  ROLE_CUSTOMER,
  ROLE_RETAILER,
  ROLE_SALES_REP,
} from '../helpers/constants';

// Set user info from request
export function setUserInfo(request) {
  return {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.email,
    role: request.role,
  };
}

// Get user role
export function getRole(checkRole) {
  let role;

  switch (checkRole) {
  case ROLE_ADMIN:
    role = 4;
    break;
  case ROLE_SALES_REP:
    role = 3;
    break;
  case ROLE_CUSTOMER:
    role = 2;
    break;
  case ROLE_RETAILER:
    role = 1;
    break;
  default:
    role = 2;
  }

  return role;
}
