'use strict';

const newRoles = ['manager', 'Admin', 'Moderator', 'Support'];
const enumName = 'enum_Users_role';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Drop the default value from the role column
    await queryInterface.sequelize.query(`ALTER TABLE "Users" ALTER COLUMN "role" DROP DEFAULT;`);

    // 2. Create the ENUM type
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "${enumName}";`); // for safety
    await queryInterface.sequelize.query(`CREATE TYPE "${enumName}" AS ENUM(${newRoles.map(r => `'${r}'`).join(', ')});`);

    // 3. Change the column type to the new ENUM
    await queryInterface.sequelize.query(`ALTER TABLE "Users" ALTER COLUMN "role" TYPE "${enumName}" USING role::text::"${enumName}";`);

    // 4. Set the new default value
    await queryInterface.sequelize.query(`ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'manager';`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`ALTER TABLE "Users" ALTER COLUMN "role" DROP DEFAULT;`);
    await queryInterface.sequelize.query(`ALTER TABLE "Users" ALTER COLUMN "role" TYPE VARCHAR(255);`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "${enumName}";`);
  }
};