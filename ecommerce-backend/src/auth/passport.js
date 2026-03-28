import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/index.js';
import dotenv from 'dotenv';
import { generateToken, verifyToken } from '../config/jwt.js';

dotenv.config();

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, displayName, emails, photos } = profile;

    console.log('Google profile:', {
      id,
      displayName,
      email: emails?.[0]?.value,
      photo: photos?.[0]?.value,
    });

    let [user, created] = await User.findOrCreate({
      where: { google_id: id },
      defaults: {
        google_id: id,
        email: emails[0].value,
        name: displayName,
        picture: photos[0].value,
        role: 'user',
      },
      attributes: ['id', 'google_id', 'email', 'name', 'picture', 'created_at', 'role','jwt','jwt_expires_at','jwt_created_at','jwt_revoked']
    });

    const token = generateToken(user);
    const decodedToken = verifyToken(token);
    const jwtExpiresAt = new Date(decodedToken.exp * 1000);

    await user.update({
      jwt: token,
      jwt_expires_at: jwtExpiresAt,
      jwt_created_at: new Date(),
      jwt_revoked: false
    });

    console.log(created ? 'New user created and JWT set:' : 'Existing user found and JWT updated:', user.toJSON());
    done(null, user);
  } catch (err) {
    console.error('Google auth error:', err);
    done(err, null);
  }
}));