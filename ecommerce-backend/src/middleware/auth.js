import { verifyToken } from '../config/jwt.js';

export const requireAuth = (req, res, next) => {
  try {
    // Check header or cookie for token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }

    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Authentication failed'
    });
  }
};