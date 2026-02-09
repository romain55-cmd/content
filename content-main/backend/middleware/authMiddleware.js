const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = asyncHandler(async (req, res, next) => {
  console.log('Protect middleware running'); // Added for debugging
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, 'secret');

      // Get user from the token
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
      console.log('req.user after protect:', req.user); // Added for debugging
      
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized as an Admin');
  }
};

const moderator = (req, res, next) => {
  if (req.user && (req.user.role === 'Admin' || req.user.role === 'Moderator')) {
    next();
  } else {
    res.status(4e3); // Forbidden
    throw new Error('Not authorized as a Moderator or Admin');
  }
};

const support = (req, res, next) => {
  if (req.user && (req.user.role === 'Admin' || req.user.role === 'Moderator' || req.user.role === 'Support')) {
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized for this action');
  }
};


module.exports = { protect, admin, moderator, support };
