const yooKassa = require('../config/yookassa');
const { User, Product } = require('../models'); // Ensure Product is imported
const { v4: uuidv4 } = require('uuid');

// @desc    Create a new payment
// @route   POST /api/payments/create
// @access  Private
const createPayment = async (req, res) => {
  // Add productId to the destructured request body
  const { price, currency, description, productId } = req.body;
  const userId = req.user.id;

  if (!productId) {
    res.status(400);
    throw new Error('productId is required');
  }

  try {
    const payment = await yooKassa.createPayment({
      amount: {
        value: price,
        currency: currency,
      },
      payment_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.CLIENT_URL}/payment-success`,
      },
       receipt: {
        customer: {
          email: req.user.email,
        },
        items: [
          {
            description: description || 'Подписка на Momentum',
            quantity: '1.00',
            amount: {
              value: price,
              currency: currency,
            },
            vat_code: '1', // Без НДС
            payment_subject: 'service',
            payment_mode: 'full_payment',
          },
        ],
      },
      description: description || 'Оплата подписки',
      metadata: {
        userId: userId,
        productId: productId, // Add productId to metadata
      },
    });

    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// @desc    Handle Yookassa webhook
// @route   POST /api/payments/webhook
// @access  Public
const handleWebhook = async (req, res) => {
  console.log('Webhook received:', req.body); // Log the entire webhook body

  const { event, object: payment } = req.body;

  try {
    if (event === 'payment.succeeded' || event === 'payment.waiting_for_capture') {
      const { userId, productId } = payment.metadata; // Extract productId from metadata
      console.log('Payment Succeeded/Waiting for capture for userId:', userId, 'productId:', productId, 'Payment ID:', payment.id);

      if (!userId || !productId) {
        console.error('Webhook metadata is missing userId or productId');
        return res.status(400).send('Webhook metadata is missing userId or productId');
      }
      
      const user = await User.findByPk(userId);
      const product = await Product.findByPk(productId);

      if (user && product) {
        console.log('User and Product found:', user.id, product.id);
        const now = new Date();
        const oneMonthLater = new Date(now);
        oneMonthLater.setMonth(now.getMonth() + 1);

        user.subscription_provider = 'yookassa';
        user.subscription_id = payment.id;
        user.subscription_status = 'active';
        user.productId = productId; // Set the productId on the user
        user.has_unlimited_generations = true;
        user.freeGenerationsLeft = 1000;
        user.subscriptionStartDate = now;
        user.subscriptionEndDate = oneMonthLater;

        console.log('Attempting to save user with subscription dates and productId:');
        console.log('  subscriptionStartDate:', user.subscriptionStartDate);
        console.log('  subscriptionEndDate:', user.subscriptionEndDate);
        console.log('  productId:', user.productId);

        await user.save();
        console.log('User saved successfully with updated subscription info.');
      } else {
        console.log(`User not found for userId: ${userId} or Product not found for productId: ${productId}`);
      }
    } else {
      console.log('Webhook event is not payment.succeeded or payment.waiting_for_capture. Event:', event);
    }

    res.status(200).send();
  } catch (error) {
    console.error('Error processing Yookassa webhook:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createPayment,
  handleWebhook,
};
