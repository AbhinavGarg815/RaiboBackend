import GoogleStrategy from "passport-google-oauth20";
import models from "../models/index.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

export default (passportSetup) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      models.User.findById(jwt_payload._id)
        .then((user) => {
          if (user) return done(null, user);
          return done(null, false);
        })
        .catch((err) => console.log(err));
    }),
  );
};
