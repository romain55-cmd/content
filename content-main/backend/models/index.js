'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/db'); // Use the single instance of sequelize
const basename = path.basename(__filename);
const db = {};

// Find all model files and initialize them
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    // Each model file exports a function that needs to be called with sequelize and DataTypes
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Associate models if they have an 'associate' method
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Keep the custom syncAll function
db.syncAll = async () => {
  await sequelize.sync({ alter: true });
  console.log("All models were synchronized successfully.");
};

module.exports = db;