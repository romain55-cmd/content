const express = require('express');
const router = express.Router();
const {
    getInvoices,
    createInvoice,
    getInvoiceById,
    markInvoiceAsPaid,
} = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getInvoices)
  .post(createInvoice);

router.route('/:id')
  .get(getInvoiceById);

router.route('/:id/pay')
  .put(markInvoiceAsPaid);

module.exports = router;
