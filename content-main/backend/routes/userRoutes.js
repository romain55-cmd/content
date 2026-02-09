const express = require('express');
const router = express.Router();
const { getUserProfile, getUsers, getMe, updateMe, activateSubscription } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes here are protected
router.use(protect);

router.get('/profile', getUserProfile);
router.get('/me', getMe); // New route to get current user details
router.put('/me', updateMe); // New route to update current user details
router.put('/me/activate-subscription', activateSubscription); // Manual activation

// Admin routes
router.get('/', admin, getUsers);

module.exports = router;