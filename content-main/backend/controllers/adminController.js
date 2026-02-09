const asyncHandler = require('express-async-handler');
const { User, Product, ActionLog, PromoCode, AuditLog } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const yooKassa = require('../config/yookassa');

// ... (other functions remain the same)

const getDashboardData = asyncHandler(async (req, res) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // --- Database Queries ---
  const newUsersPromise = User.count({ where: { createdAt: { [Op.gte]: oneMonthAgo } } });
  const totalUsersPromise = User.count();
  
  const activeSubscribedUsersPromise = User.findAll({
    where: { subscription_status: 'active', productId: { [Op.ne]: null } },
    include: [{ model: Product, required: true }],
  });

  const userRegistrationPromise = User.findAll({
    attributes: [
      [fn('date_trunc', 'day', col('createdAt')), 'date'],
      [fn('count', col('id')), 'count'],
    ],
    where: { createdAt: { [Op.gte]: oneMonthAgo } },
    group: ['date'],
    order: [['date', 'ASC']],
    raw: true,
  });

  const planDistributionPromise = User.findAll({
    attributes: ['productId', [fn('count', col('User.id')), 'count']],
    include: [{ model: Product, attributes: ['name'], required: true }],
    group: ['productId', 'Product.id', 'Product.name'],
    raw: true,
  });

  const topFeaturesPromise = ActionLog.findAll({
    attributes: ['action', [fn('count', col('action')), 'count']],
    group: ['action'],
    order: [[fn('count', col('action')), 'DESC']],
    limit: 10,
    raw: true,
  });

  // --- YooKassa API Query ---
  let totalRevenueCollected = 0;
  try {
    console.log('Fetching payments from YooKassa for total revenue...');
    const successfulPayments = await yooKassa.getPaymentsList({
      status: 'succeeded',
      limit: 200, // Get the last 200 successful payments
    });
    console.log('[Debug] YooKassa response:', JSON.stringify(successfulPayments, null, 2));

    if (successfulPayments && successfulPayments.items) {
      console.log(`[Debug] Found ${successfulPayments.items.length} successful payments.`);
      totalRevenueCollected = successfulPayments.items.reduce((total, payment) => {
        return total + parseFloat(payment.amount.value);
      }, 0);
      console.log(`[Debug] Calculated total revenue: ${totalRevenueCollected}`);
    } else {
      console.log('[Debug] No "items" array found in YooKassa response.');
    }
  } catch (yooKassaError) {
    console.error("Could not fetch total revenue from YooKassa:", yooKassaError);
    // If this fails, we'll just send 0 and not crash the dashboard
  }

  // --- Resolve all promises ---
  const [
    newUsers,
    totalUsers,
    activeSubscribedUsers,
    userRegistration,
    planDistribution,
    topFeatures
  ] = await Promise.all([
    newUsersPromise,
    totalUsersPromise,
    activeSubscribedUsersPromise,
    userRegistrationPromise,
    planDistributionPromise,
    topFeaturesPromise
  ]);

  // --- Calculations ---
  const mrr = activeSubscribedUsers.reduce((total, user) => total + user.Product.price, 0);
  const arr = mrr * 12;

  // --- Final Response ---
  res.json({
    newUsers,
    totalUsers,
    mrr,
    arr,
    totalRevenueCollected, // Add new metric here
    userRegistration,
    planDistribution: planDistribution.map(p => ({ name: p['Product.name'], value: parseInt(p.count, 10) })),
    topFeatures,
    activeUsers: { dau: 0, wau: 0, mau: 0 },
    churnRate: 0,
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, role } = req.query;
  const offset = (page - 1) * limit;

  const where = {};
  if (search) {
    where[Op.or] = [
      { email: { [Op.iLike]: `%${search}%` } },
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (role) {
    where.role = role;
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    attributes: { exclude: ['password'] },
  });

  res.json({
    users: rows,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page, 10),
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] },
    include: [Product],
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (user) {
    const {
      email,
      firstName,
      lastName,
      role,
      subscription_status,
      productId,
    } = req.body;

    user.email = email || user.email;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.role = role || user.role;
    user.subscription_status = subscription_status || user.subscription_status;
    user.productId = productId || user.productId;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (user) {
    // Prevent admin from deleting themselves or the main admin account
    if (user.id === req.user.id) {
      res.status(400);
      throw new Error('You cannot delete your own account.');
    }
    // This is a simple check, could be made more robust
    if (user.email === 'admin@example.com') {
        res.status(400);
        throw new Error('Cannot delete the main admin account.');
    }

    await user.destroy();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


const getPromoCodes = asyncHandler(async (req, res) => {
  const promoCodes = await PromoCode.findAll({
    order: [['createdAt', 'DESC']],
  });
  res.json(promoCodes);
});

const createPromoCode = asyncHandler(async (req, res) => {
  const { code, discountType, discountValue, expiresAt, isActive } = req.body;

  const promoCode = await PromoCode.create({
    code,
    discountType,
    discountValue,
    expiresAt,
    isActive,
  });

  res.status(201).json(promoCode);
});

const getAuditLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 15, userId, action } = req.query;
  const offset = (page - 1) * limit;

  const where = {};
  if (userId) {
    where.userId = userId;
  }
  if (action) {
    where.action = action;
  }

  const { count, rows } = await AuditLog.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [{
      model: User,
      attributes: ['id', 'firstName', 'lastName', 'email'],
    }],
  });

  res.json({
    logs: rows,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page, 10),
  });
});

const getAiContent = asyncHandler(async (req, res) => {
  console.log('getAiContent called');
  console.log('ActionLog model:', ActionLog);

  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await ActionLog.findAndCountAll({
      where: { action: 'generate_content' },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'email'],
      }],
    });

    console.log('ActionLog.findAndCountAll result:', { count, rows });

    res.json({
      content: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    console.error('Error in getAiContent:', error);
    res.status(500).json({ message: error.message });
  }
});

const getPayments = asyncHandler(async (req, res) => {
  try {
    const { limit = 10, cursor } = req.query;
    const payments = await yooKassa.getPaymentsList({
      limit,
      cursor,
    });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments from YooKassa:', error);
    res.status(500).send('Server error');
  }
});

module.exports = {
  getDashboardData,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getPromoCodes,
  createPromoCode,
  getAuditLogs,
  getAiContent,
  getPayments,
};