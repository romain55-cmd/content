const asyncHandler = require('express-async-handler');
const { Client, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all clients with filtering, sorting, and pagination
// @route   GET /api/clients
// @access  Private
const getClients = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', status, search } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }
  if (search) {
    query.companyName = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
  }

  const clients = await Client.findAndCountAll({
    where: query,
    order: [[sortBy, order.toUpperCase()]],
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    include: [{ model: User, attributes: ['firstName', 'lastName'] }],
  });

  res.json({
    clients: clients.rows,
    totalPages: Math.ceil(clients.count / limit),
    currentPage: page,
    totalClients: clients.count,
  });
});

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private
const createClient = asyncHandler(async (req, res) => {
  const { companyName, contactName, email, phone, address, status } = req.body;

  const client = await Client.create({
    companyName,
    contactName,
    email,
    phone,
    address,
    status,
    managedBy: req.user.id, // Assign logged-in user as manager
  });

  res.status(201).json(client);
});

// @desc    Get a single client by ID
// @route   GET /api/clients/:id
// @access  Private
const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findByPk(req.params.id, {
    include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }],
  });

  if (client) {
    res.json(client);
  } else {
    res.status(404);
    throw new Error('Client not found');
  }
});

// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Private
const updateClient = asyncHandler(async (req, res) => {
  const { companyName, contactName, email, phone, address, status, managedBy } = req.body;

  const client = await Client.findByPk(req.params.id);

  if (client) {
    client.companyName = companyName || client.companyName;
    client.contactName = contactName || client.contactName;
    client.email = email || client.email;
    client.phone = phone || client.phone;
    client.address = address || client.address;
    client.status = status || client.status;
    if (req.user.role === 'admin' && managedBy) {
      client.managedBy = managedBy; // This should be the ID
    }

    const updatedClient = await client.save();
    res.json(updatedClient);
  } else {
    res.status(404);
    throw new Error('Client not found');
  }
});

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private/Admin
const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findByPk(req.params.id);

  if (client) {
    await client.destroy(); // Sequelize method for deletion
    res.json({ message: 'Client removed' });
  } else {
    res.status(404);
    throw new Error('Client not found');
  }
});

module.exports = {
  getClients,
  createClient,
  getClientById,
  updateClient,
  deleteClient,
};