const express = require('express');
const router = express.Router();
const { generatePromoCode, applyPromoCode } = require('../controllers/promoCodeController');

router.route('/').post(generatePromoCode);
router.route('/apply').post(applyPromoCode); // New route for applying promo codes

module.exports = router;
