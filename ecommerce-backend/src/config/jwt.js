import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/index.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '04eb2e7bb7a1a94d5b7cd5aeada89e7afe40d4b82f4a6be3142d3a5fcddb30f7';
const JWT_EXPIRES_IN = '7d'; // 7 days

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      google_id: user.google_id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
export const verifyJWT = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.jwt || req.headers['authorization']?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      // Verify JWT signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Lookup user and verify token matches
      const user = await User.findOne({
        where: {
          id: decoded.id,
          jwt: token,
          jwt_revoked: false
        }
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid or revoked token' });
      }

      if (new Date() > new Date(user.jwt_expires_at)) {
        return res.status(401).json({ error: 'Token expired' });
      }

      // Optional: Role-based protection
      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ error: 'Insufficient privileges' });
      }

      // Attach user info to request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };
      console.log(req.user);
      console.log(user);
      next();
    } catch (err) {
      console.error('JWT Middleware error:', err);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};