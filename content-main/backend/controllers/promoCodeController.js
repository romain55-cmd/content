const { PromoCode } = require('../models');
const crypto = require('crypto');

// Function to generate a random alphanumeric string for the promo code
const generateUniqueCode = async () => {
  let code;
  let isUnique = false;
  let attempts = 0;
  const MAX_ATTEMPTS = 10; // Prevent infinite loops

  while (!isUnique && attempts < MAX_ATTEMPTS) {
    code = crypto.randomBytes(5).toString('hex').toUpperCase(); // Generates a 10-character hex string
    const existingCode = await PromoCode.findOne({ where: { code } });
    if (!existingCode) {
      isUnique = true;
    }
    attempts++;
  }
  if (!isUnique) {
    throw new Error('Could not generate a unique promo code after several attempts.');
  }
  return code;
};

// @desc    Generate a new promo code
// @route   POST /api/promocodes
// @access  Public (for now, could be admin-only later)
exports.generatePromoCode = async (req, res) => {
  const { email } = req.body;
  console.log('Received request to generate promo code for email:', email);

  try {
    const code = await generateUniqueCode();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // Promo code valid for 1 month

    const promoCode = await PromoCode.create({
      code,
      discountType: 'percentage', // Hardcoded for now
      discountValue: 30,         // Hardcoded for now (30% off)
      isActive: true,
      expiresAt,
    });

    console.log('Successfully generated promo code:', promoCode.code, 'for email:', email);

    res.status(201).json({
      success: true,
      data: {
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        expiresAt: promoCode.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error generating promo code for email:', email, 'Error details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate promo code',
      error: error.message,
    });
  }
};

// @desc    Apply a promo code to get a discounted price
// @route   POST /api/promocodes/apply
// @access  Public
exports.applyPromoCode = async (req, res) => {
  const { code, originalPrice } = req.body;
  console.log('Received request to apply promo code:', code, 'to price:', originalPrice);

  if (!code || !originalPrice) {
    return res.status(400).json({ success: false, message: 'Promo code and original price are required.' });
  }

  try {
    const promoCodeDoc = await PromoCode.findOne({ where: { code } });

    if (!promoCodeDoc) {
      return res.status(404).json({ success: false, message: 'Promo code not found.' });
    }

    if (!promoCodeDoc.isActive) {
      return res.status(400).json({ success: false, message: 'Promo code is not active.' });
    }

    if (promoCodeDoc.expiresAt && new Date() > new Date(promoCodeDoc.expiresAt)) {
      return res.status(400).json({ success: false, message: 'Promo code has expired.' });
    }

    let discountedPrice = originalPrice;

    if (promoCodeDoc.discountType === 'percentage') {
      discountedPrice = originalPrice * (1 - promoCodeDoc.discountValue / 100);
    } else if (promoCodeDoc.discountType === 'fixed_amount') {
      discountedPrice = originalPrice - promoCodeDoc.discountValue;
    }

    // Ensure price doesn't go below zero
    discountedPrice = Math.max(0, discountedPrice);

    res.status(200).json({
      success: true,
      data: {
        originalPrice,
        discountedPrice: parseFloat(discountedPrice.toFixed(2)),
        discountValue: promoCodeDoc.discountValue,
        discountType: promoCodeDoc.discountType,
      },
    });
  } catch (error) {
    console.error('Error applying promo code:', code, 'Error details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply promo code',
      error: error.message,
    });
  }
};

exports.generateUniqueCode = generateUniqueCode; // Export the helper function
