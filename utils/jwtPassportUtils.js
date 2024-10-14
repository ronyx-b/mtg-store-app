import { sign } from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";

/** @type {import ("passport-jwt").StrategyOptionsWithoutRequest} */
let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.JWT_SECRET,
};

/** @type {Strategy} */
let strategy = new Strategy(jwtOptions, function (jwt_payload, next) {
  // console.log('payload received', jwt_payload);

  if (jwt_payload) {
    next(null, {
      _id: jwt_payload._id,
      email: jwt_payload.email,
      isAdmin: jwt_payload.isAdmin
    });
  } else {
    next(null, false);
  }
});

passport.use(strategy);

/**
 * gets a signed token
 * @param {{_id: string, email: string, isAdmin: boolean}} tokenPayload token data payload 
 * @param {string} [expiresIn] time for token to expire 
 * @returns 
 */
const signToken = (tokenPayload, optionsExpiresIn = { expiresIn: "24h" }) => {
  const token = sign(tokenPayload, jwtOptions.secretOrKey, optionsExpiresIn);
  return token;
}

/**
 * Checks if request has user validated and if it is an Admin
 * @async
 * @param {import("next/server").NextRequest} req 
 * @param {import("next/server").NextResponse} res
 * @returns {{ _id: string, email: string, isAdmin: boolean }} An object with user token payload 
 */
const getUser = (req, res) => {
  passport.authenticate("jwt", { session: false })(req, res, () => {});
  return req?.user;
};

/**
 * Checks if request has user validated and if it is an Admin
 * @async
 * @param {import("next/server").NextRequest} req 
 * @param {import("next/server").NextResponse} res
 * @returns {boolean} isAdmin value
 */
const isAdmin = (req, res) => {
  passport.authenticate("jwt", { session: false })(req, res, () => {});
  return req?.user?.isAdmin;
};


/* ********** Export jwt Passport Utils ********** */
const jwtPassportUtils = {
  signToken,
  getUser,
  isAdmin,
};

export default jwtPassportUtils;