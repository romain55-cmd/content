const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  getUsers,
  getUserById,
  updateUser,
  deleteUser, // Added deleteUser
  getPromoCodes,
  createPromoCode,
  getAuditLogs,
  getAiContent,
  getPayments,
} = require('../controllers/adminController');
const { protect, admin, moderator } = require('../middleware/authMiddleware');
const { logAudit } = require('../middleware/auditLogMiddleware');

router.get('/dashboard', protect, admin, getDashboardData);

// User management
router.get('/users', protect, admin, getUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id', protect, admin, logAudit('update_user'), updateUser);
router.delete('/users/:id', protect, admin, logAudit('delete_user'), deleteUser); // New delete route

// Promo code management
router.get('/promocodes', protect, admin, getPromoCodes);
router.post('/promocodes', protect, admin, logAudit('create_promo_code'), createPromoCode);

// Audit logs
router.get('/audit-logs', protect, admin, getAuditLogs);

// AI Content Moderation
router.get('/ai-content', protect, moderator, getAiContent);

// Payment Management
router.get('/payments', protect, admin, getPayments);

module.exports = router;
