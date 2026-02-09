const asyncHandler = require('express-async-handler');
const { Invoice, Client, Product } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
const getInvoices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'issueDate', order = 'desc', status, clientId } = req.query;
  
  const query = {};
  if (status) query.status = status;
  if (clientId) query.clientId = clientId;

  const { count, rows } = await Invoice.findAndCountAll({
    where: query,
    order: [[sortBy, order.toUpperCase()]],
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    include: [{ model: Client, attributes: ['companyName'] }],
  });

  res.json({
    invoices: rows,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
  });
});

// @desc    Create an invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = asyncHandler(async (req, res) => {
    const { client, issueDate, dueDate, lineItems, notes, tax, status } = req.body;

    // In a real app, you would wrap this in a transaction
    const invoice = await Invoice.create({
        clientId: client, // Assuming 'client' is the ID
        issueDate,
        dueDate,
        lineItems, // This assumes lineItems is a JSONB field
        notes,
        tax,
        status,
    });

    res.status(201).json(invoice);
});

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findByPk(req.params.id, {
        include: [{ model: Client, attributes: ['companyName', 'email'] }]
    });
    if (invoice) {
        res.json(invoice);
    } else {
        res.status(404);
        throw new Error('Invoice not found');
    }
});

// @desc    Mark an invoice as paid
// @route   PUT /api/invoices/:id/pay
// @access  Private
const markInvoiceAsPaid = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findByPk(req.params.id);

    if (invoice) {
        invoice.status = 'paid';
        await invoice.save();
        res.json({ message: `Invoice ${invoice.invoiceNumber} marked as paid.`});
    } else {
        res.status(404);
        throw new Error('Invoice not found');
    }
});

module.exports = {
    getInvoices,
    createInvoice,
    getInvoiceById,
    markInvoiceAsPaid,
}