const express = require('express');
const passport = require('passport');
const router = express.Router();
const generateToken = require('../utils/generateToken');
const { registerUser, loginUser } = require('../controllers/userController');

// @desc    Register user
// @route   POST /api/auth/register
router.post('/register', registerUser);

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', loginUser);

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // On successful authentication, user object is attached to req by Passport
    const token = generateToken(req.user.id, req.user.role);
    // Redirect to a frontend route that can handle the token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/success?token=${token}`);
  }
);

// @desc    Auth with VK
// @route   GET /api/auth/vk
router.get('/vk', passport.authenticate('vkontakte', { scope: ['email'] }));

// @desc    VK auth callback
// @route   GET /api/auth/vk/callback
router.get(
  '/vk/callback',
  passport.authenticate('vkontakte', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = generateToken(req.user.id, req.user.role);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/success?token=${token}`);
  }
);

module.exports = router;
