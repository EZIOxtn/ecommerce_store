import express from 'express';
import { User } from '../models/index.js';
import session from 'express-session';
import pool from '../db.js';
import { generateToken } from '../config/jwt.js';
import { requireAuth } from '../middleware/auth.js';
import { Order, OrderItem } from '../models/index.js';

const router = express.Router();

// Get user by Google ID - Optimized version
router.post('/get-user', async (req, res) => {
  const {jwt} = req.cookies;
  if (!jwt) {
    return res.header({'x-powered-by': 'OZIRIS'}).status(401).json({ 
      status: 'error', 
      message: 'Not authenticated' 
    });
  }
  try {
    const user = await User.findOne({
      where: { jwt },
      attributes: [
       
        ['name', 'displayName'],
        'email',
        ['picture', 'photo']
      ]
    });
    
    if (!user) {
      return res.header({'x-powered-by': 'OZIRIS'}).status(404).json({ 
        status: 'error', 
        message: 'User not found' 
      });
    }

    
    req.session.user = {
      google_id: user.dataValues.google_id,
      displayName: user.dataValues.displayName,
      email: user.dataValues.email,
      photo: user.dataValues.photo,
    };

    res.header({'x-powered-by': 'OZIRIS'}).json({ 
      status: 'success', 
      data: [user] ,
      endpoint: '/getmyitemsinfo'
    });
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
});

router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ 
      status: 'success', 
      data: req.session.user 
    });
  } else {
    res.status(401).json({ 
      status: 'error', 
      message: 'Not authenticated' 
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  const { name, email } = req.body;
  
  if (!req.session.user) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Not authenticated' 
    });
  }

  try {
    const [updatedRowsCount, updatedUsers] = await User.update(
      { name, email },
      { 
        where: { google_id: req.session.user.google_id },
        returning: true
      }
    );
    
    if (updatedRowsCount === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'User not found' 
      });
    }

    const updatedUser = updatedUsers[0];
    
    // Update session
    req.session.user = {
      ...req.session.user,
      displayName: updatedUser.name,
      email: updatedUser.email
    };

    res.json({ 
      status: 'success', 
      data: updatedUser 
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { google_id } = req.body;
  
  if (!google_id) {
    return res.header({'x-powered-by': 'OZIRIS'}).status(400).json({ 
      status: 'error', 
      message: 'Missing google_id' 
    });
  }

  try {
    const user = await User.findOne({
      where: { google_id },
      attributes: ['id', 'google_id', 'email', 'name', 'picture', 'role']
    });
    
    if (!user) {
      return res.header({'x-powered-by': 'OZIRIS'}).status(404).json({ 
        status: 'error', 
        message: 'User not found' 
      });
    }

    // Generate JWT
    const token = generateToken(user);
    
    // Save user info in session
    req.session.user = {
      id: user.id,
      google_id: user.google_id,
      displayName: user.name,
      email: user.email,
      photo: user.picture,
      role: user.role
    };

    // Set JWT as cookie for HTTP
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false, // HTTP only
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.header({'x-powered-by': 'OZIRIS'}).json({ 
      status: 'success', 
      data: {
        user: {
          google_id: user.google_id,
          displayName: user.name,
          email: user.email,
          photo: user.picture,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.header({'x-powered-by': 'OZIRIS'}).status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
});

// Logout route
router.post('/logout', async (req, res) => {
  try {
    // Invalidate JWT in the database
    if (req.user && req.user.id) { // Ensure user is authenticated and has an ID
      await User.update(
        {
          jwt: null,
          jwt_expires_at: null,
          jwt_created_at: null,
          jwt_revoked: true
        },
        {
          where: { id: req.user.id }
        }
      );
      console.log(`JWT invalidated in DB for user ID: ${req.user.id}`);
    }

    req.session.destroy(err => {
      if (err) {
        console.error('Session logout error:', err);
        return res.status(500).json({
          status: 'error',
          message: 'Logout failed'
        });
      }
      
      // Clear JWT cookie
      res.clearCookie('jwt', {
        httpOnly: true,
        secure: true, // Should be true if using HTTPS
        sameSite: 'none' // Should be 'none' if cross-site, 'lax' or 'strict' if same-site
      });
      res.clearCookie('connect.sid');
      
      res.header({'x-powered-by': 'OZIRIS'}).json({
        status: 'success',
        message: 'Logged out successfully'
      });
    });
  } catch (error) {
    console.error('Error during logout process:', error);
    res.header({'x-powered-by': 'OZIRIS'}).status(500).json({
      status: 'error',
      message: 'Internal server error during logout'
    });
  }
});

// Add protected routes
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ['id', 'google_id', 'email', 'name', 'picture', 'created_at']
    });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.header({'x-powered-by': 'OZIRIS'}).json({
      status: 'success',
      data: {
        id: user.id,
        google_id: user.google_id,
        displayName: user.name,
        email: user.email,
        photo: user.picture,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

router.get('/getmyitemsinfo', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ status: 'error', message: 'User ID missing' });
    }

    const orders = await Order.findAll({
      where: { user_id: userId },
      // include OrderItem only if it's defined
      // include: [{ model: OrderItem, as: 'orderItems' }],
      order: [['created_at', 'DESC']]
    });

    res.header({'x-powered-by': 'OZIRIS'}).json({
      status: 'success',
      message: orders.length > 0 ? 'Orders fetched' : 'No orders found',
      data: orders
    });
  } catch (err) {
    console.error('Order fetch error:', err);
    res.header({'x-powered-by': 'OZIRIS'}).status(500).json({ status: 'error', message: 'Server error' });
  }
});


export default router;

