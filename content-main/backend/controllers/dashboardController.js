const asyncHandler = require('express-async-handler');
const { Invoice, Client } = require('../models');
const { Op, fn, col } = require('sequelize');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  // 1. Total Revenue (sum of all 'paid' invoices)
  const totalRevenue = await Invoice.sum('total', {
    where: { status: 'paid' }
  });

  // 2. New clients this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const newClientsCount = await Client.count({
    where: { createdAt: { [Op.gte]: startOfMonth } }
  });

  // 3. Total amount overdue
  const totalOverdueAmount = await Invoice.sum('total', {
    where: { status: 'overdue' }
  });

  // 4. Counts of invoices by status
  const invoiceStatusCountsResult = await Invoice.findAll({
    group: ['status'],
    attributes: ['status', [fn('COUNT', col('status')), 'count']],
    raw: true,
  });

  // Format the results
  const stats = {
    totalRevenue: totalRevenue || 0,
    newClientsThisMonth: newClientsCount || 0,
    totalOverdueAmount: totalOverdueAmount || 0,
    invoiceStatusCounts: invoiceStatusCountsResult.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count, 10);
      return acc;
    }, {}),
  };

  res.json(stats);
});

module.exports = { getDashboardStats };
