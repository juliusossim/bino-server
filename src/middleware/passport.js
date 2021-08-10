import passport from 'passport';
import '../config/global';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../models');

const PUB_KEY = global.config.common.APP_PUB_KEY;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

const User = db.User;
const UserProfile = db.UserProfile;

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await User.findOne({
      where: {
        id: payload.userId,
        email: payload.email,
        emailVerified: true,
        isActive: true,
      },
    });

    const userProfile = await UserProfile.findOne({
      where: {
        userId: user.id,
      },
    });

    const { id, email, firstName, lastName, phone, emailVerified, isActive } =
      user;

    const loggedInUser = {
      id,
      email,
      firstName,
      lastName,
      phone,
      emailVerified,
      isActive,
      profileId: userProfile?.id ?? null,
    };
    if (user) {
      return done(null, loggedInUser);
    }
    return done(null, false);
  } catch (err) {
    console.log(err);
  }
});

passport.use(strategy);

export const requireAuth = passport.authenticate('jwt', { session: false });
