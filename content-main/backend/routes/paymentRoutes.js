const express = require('express');
const router = express.Router();
const {
  createPayment,
  handleWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createPayment);
router.post('/webhook', express.json(), handleWebhook);

module.exports = router;
