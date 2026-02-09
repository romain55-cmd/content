const { Sequelize } = require('sequelize');

// Determine the current environment
const env = process.env.NODE_ENV || 'development';

// Load the correct configuration for the current environment
const config = require('./config.js')[env];

let sequelize;

// Initialize Sequelize with the correct configuration
if (config.use_env_variable) {
  // This block is for environments like Heroku where the DB URL is in one variable
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // This is the standard way, using individual database credentials
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { sequelize, connectDB };