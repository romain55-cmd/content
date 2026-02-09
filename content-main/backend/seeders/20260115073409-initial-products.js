'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = [
      {
        id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Fixed UUID for consistency
        name: 'Starter',
        description: 'Основной платный тариф',
        price: 10,
        unit: 'monthly',
        sku: 'STARTER_PLAN',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await queryInterface.bulkInsert('Products', products, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', { sku: 'STARTER_PLAN' }, {});
  }
};