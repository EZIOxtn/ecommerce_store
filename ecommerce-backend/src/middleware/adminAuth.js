import { User } from '../models/index.js';

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ['id', 'role']
    });
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin privileges required'
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};