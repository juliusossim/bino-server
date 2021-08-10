import bcrypt from 'bcrypt-nodejs';
import { issueJwt, responseObject, responseInfo } from '../helpers/common';
import { v4 } from 'uuid';
import db from '../models';
import {
  HTTP_BAD_GATEWAY,
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_OK,
  HTTP_SERVER_ERROR,
} from '../helpers/httpCodes';
import util from 'util';
import jwt from 'jsonwebtoken';
import { sendMail } from '../helpers/mailer';
import '../config/global';

const User = db.User;
const UserProfile = db.UserProfile;
const genSalt = util.promisify(bcrypt.genSalt);
const hashPassword = util.promisify(bcrypt.hash);
const verifyToken = util.promisify(jwt.verify);
const comparePasswords = util.promisify(bcrypt.compare);

/**
 * Authenticates User with valid credentials
 * @param {string} userEmail
 * @param {string} password
 * @returns User's login information with a signed token
 */
export const loginUser = async (userEmail, password) => {
  try {
    const user = await User.findOne({
      where: { email: userEmail },
    });

    if (user === null) {
      const error = new Error('Incorrect Email or Password');
      return responseInfo(HTTP_BAD_REQUEST, 'error', null, error.message);
    }

    if (!user.emailVerified) {
      const error = new Error(
        'You have not verified your email. Kindly verify your email to login'
      );
      return responseInfo(HTTP_BAD_REQUEST, 'error', null, error.message);
    }

    const isMatch = await comparePasswords(password, user.password);

    if (!isMatch) {
      const error = new Error('Incorrect Email or Password');
      return responseInfo(HTTP_BAD_REQUEST, 'error', null, error.message);
    }

    const userProfile = await UserProfile.findOne({
      where: { userId: user.id },
    });

    let loggedInUser = { ...user.dataValues };
    if (userProfile)
      loggedInUser = { ...user.dataValues, profileId: userProfile.id };

    const jwt = issueJwt(loggedInUser);

    if (!jwt) {
      const error = new Error(
        'The system encountered an error trying to sign you in. Please try again.'
      );
      return responseInfo(HTTP_BAD_REQUEST, 'error', null, error.message);
    }

    const { id, firstName, lastName, email, phone, roles } = loggedInUser;

    const newUser = {
      user: {
        id,
        firstName,
        lastName,
        email,
        phone,
        roles,
        profileId: loggedInUser.profileId ?? null,
      },
      token: jwt.token,
      expiresIn: jwt.expires,
    };
    return responseInfo(HTTP_OK, 'success', newUser, 'LoggedIn successfully');
  } catch (err) {
    console.log(err);
    // eslint-disable-next-line no-undef
    return responseInfo(HTTP_SERVER_ERROR, 'error', null, err.message);
  }
};

/**
 * Creates a user in the database and returns the user's basic detials.
 *
 * @param {object} data
 * @returns User object
 */
export const createUser = async (data) => {
  const { firstName, lastName, email, password, phone, roles } = data;

  try {
    const user = await User.findOne({
      where: { email },
    });

    if (user !== null) {
      return responseInfo(
        HTTP_BAD_REQUEST,
        'error',
        null,
        'User already exists!'
      );
    }

    const salt = await genSalt(10);
    const hashedPassword = await hashPassword(password, salt, null);

    const createdUser = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: hashedPassword,
      phone: phone.trim(),
      roles: roles,
      emailVerified: false,
      isActive: false,
      verificationKey: v4(),
    });

    await sendVerificationEmail(createdUser.dataValues);

    const newUser = {
      user: {
        id: createdUser.id,
        firstName: createdUser.firstName.trim(),
        lastName: createdUser.lastName.trim(),
        email: createdUser.email.trim(),
        phone: createdUser.phone.trim(),
        roles: createdUser.roles,
      },
    };

    return responseInfo(
      HTTP_CREATED,
      'success',
      newUser,
      'Registration Successful! Kindly login to your email account to confirm your email address.'
    );
  } catch (err) {
    console.log(err);
    if (err) {
      return responseInfo(
        HTTP_SERVER_ERROR,
        'error',
        null,
        'A server error occured'
      );
    }
  }
};

/**
 * Sends verification email to specified user.
 *
 * @param {{}} userInfo Recipient's information
 * @requires userInfo
 * @returns void
 */
export const sendVerificationEmail = async (userInfo) => {
  try {
    //send confirmation email
    const payload = {
      verificationCode: userInfo.verificationKey,
      email: userInfo.email,
    };
    const jwtSecret = global.config.common.APP_PRIV_KEY;
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: '1d',
      algorithm: 'RS256',
    });

    const confirmUrl = `${global.config.common.clientUrl}/confirm-email/${token}`;
    const sentEmail = await sendMail({
      template: 'confirm-email',
      subject: 'Confirm your Email',
      to: userInfo.email,
      recipient: userInfo,
      confirmUrl,
      gc: global.config.common,
    });
    if (sentEmail !== true) {
      return responseObject(
        res,
        HTTP_BAD_GATEWAY,
        'error',
        null,
        'Unable to send confirmation email.'
      );
    }
  } catch (err) {
    /**
     * @TODO Handle error
     */
    console.log(err);
    // return responseObject(res, 401, 'error', null, err.message);
  }
};

/**
 *
 * @param {string} token JWT token
 * @requires token
 * @returns HTTP response information
 */
export const confirmEmail = async (token) => {
  if (!token) {
    return responseInfo(
      HTTP_BAD_REQUEST,
      'error',
      null,
      'Confirmation token is missing!'
    );
  }

  const jwtSecret = global.config.common.APP_PUB_KEY;
  const decodedPayload = await verifyToken(token, jwtSecret, {
    algorithms: ['RS256'],
  });
  const user = await User.findOne({
    where: {
      email: decodedPayload.email,
      verificationKey: decodedPayload.verificationCode,
    },
    // logging: console.log
  });

  if (user instanceof User === false) {
    return responseInfo(
      HTTP_BAD_REQUEST,
      'error',
      null,
      'Invalid confirmation token!'
    );
  }

  if (user.emailVerified && user.isActive) {
    return responseInfo(
      HTTP_BAD_REQUEST,
      'error',
      null,
      'Email already verified!'
    );
  }

  //confirm user
  const updated = await User.update(
    {
      emailVerified: true,
      isActive: true,
      verificationKey: null, //we don't need this guy anymore
      // logging: console.log
    },
    {
      where: { id: user.id },
    }
  );

  if (!updated) {
    return responseInfo(
      HTTP_BAD_REQUEST,
      'error',
      null,
      'Unable to verify your email'
    );
  }

  await UserProfile.create({ userId: user.id });

  return responseInfo(
    HTTP_OK,
    'success',
    null,
    'Email verification successful'
  );
};

export const forgotPassword = async (email) => {
  try {
    const user = await User.findOne({
      where: { email: email, emailVerified: true, isActive: true },
    });

    if (user === null) {
      throw new Error(`User does not exist`);
    }

    // // Generate verification key for user
    user.verificationKey = v4();
    await user.save();

    const payload = {
      verificationCode: user.verificationKey,
      email: email,
    };

    const jwtSecret = global.config.common.APP_PRIV_KEY;
    const signedToken = jwt.sign(payload, jwtSecret, {
      expiresIn: '1d',
      algorithm: 'RS256',
    });

    const passwordResetUrl = `${global.config.common.clientUrl}/auth/reset-password/${signedToken}`;

    const sentEmail = await sendMail({
      template: 'password-reset-email',
      passwordResetUrl,
      gc: global.config.common,
      to: email,
      subject: 'Password Reset',
      recipient: user,
    });

    if (sentEmail !== true) {
      return responseObject(
        res,
        HTTP_BAD_GATEWAY,
        'error',
        null,
        'We are unable to confirm your email address. Please contact admin.'
      );
    }

    return responseInfo(
      HTTP_OK,
      'success',
      null,
      `We have sent a mail to ${email}. Kindly check your email to proceed...`
    );
  } catch (err) {
    if (err) {
      console.log(err);
      return responseInfo(HTTP_SERVER_ERROR, 'error', null, err.message);
    }
  }
};

/**
 *
 * @param {string} token
 * @param {string} newPassword
 * @returns HTTP Response with a status of success
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const jwtSecret = global.config.common.APP_PUB_KEY;
    const verified = await verifyToken(token, jwtSecret, {
      algorithms: ['RS256'],
    });

    const user = await User.findOne({
      where: {
        email: verified.email,
        verificationKey: verified.verificationCode,
      },
    });

    if (!user) {
      const error = new Error(
        `The system encountered an error while trying to process your data. Please try again.`
      );
      return responseInfo(HTTP_BAD_REQUEST, 'error', null, error.message);
    }

    const salt = await genSalt(10);
    const hashedPassword = await hashPassword(newPassword, salt, null);

    // Update user's password
    const updated = await User.update(
      {
        password: hashedPassword,
        verificationKey: null, // Reset verification key for next time
      },
      {
        where: { id: user.id },
      }
    );

    if (!updated) {
      return responseInfo(
        HTTP_BAD_REQUEST,
        'error',
        null,
        'The system encountered an error while trying to reset your password. Please try again.'
      );
    }

    /**
     * @TODO Send Email to user upon successful password reset
     */

    return responseInfo(
      HTTP_OK,
      'success',
      null,
      'You have successfully reset your password'
    );
  } catch (err) {
    if (err) {
      console.log(err);
      return responseInfo(
        HTTP_BAD_REQUEST,
        'error',
        null,
        'A server error occured'
      );
    }
  }
};
