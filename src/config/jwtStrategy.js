import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import {User} from '../models/user.model.js';


const secretOrKey = process.env.ACCESS_TOKEN_SECRET;

const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromHeader('x-auth-token'),
    secretOrKey,
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload._id);
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  },
);

export {jwtLogin}
