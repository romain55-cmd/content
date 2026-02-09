'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUserId = uuidv4();

    // Create Admin User
    await queryInterface.bulkInsert('Users', [{
      id: adminUserId,
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'Admin',
      freeGenerationsLeft: 9999,
      has_unlimited_generations: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    console.log('Admin user created with email: admin@example.com and password: admin123');
    console.log('Please change this password immediately.');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'admin@example.com' }, {});
  }
};