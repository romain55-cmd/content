'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Method to compare passwords
    comparePassword(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    }

    static associate(models) {
      // A User belongs to a Product and a PromoCode
      User.belongsTo(models.Product, { foreignKey: 'productId' });
      User.belongsTo(models.PromoCode, { foreignKey: 'promoCodeId' });

      // A User can have many Contents, ActionLogs, and AuditLogs
      User.hasMany(models.Content, { foreignKey: 'userId' });
      User.hasMany(models.ActionLog, { foreignKey: 'userId' });
      User.hasMany(models.AuditLog, { foreignKey: 'userId' });
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    googleId: {
      type: DataTypes.STRING,
    },
    vkId: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null for Google OAuth users
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // --- Profile Fields ---
    industry: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    core_message: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    brand_voice_tone: { // Storing tone directly
      type: DataTypes.STRING,
      defaultValue: 'professional',
    },
    writing_style_description: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    monthly_content_goal: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    target_audiences: { // Storing as JSON array of objects
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    content_pillars: { // Storing as JSON array of strings
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    goals_primary_goal: { // Storing primary_goal directly
      type: DataTypes.STRING,
      defaultValue: '',
    },
    preferred_platforms: { // Storing as JSON array of strings
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    // --- End Profile Fields ---
    role: {
      type: DataTypes.ENUM('manager', 'Admin', 'Moderator', 'Support'),
      defaultValue: 'manager',
    },
    freeGenerationsLeft: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      allowNull: false,
    },
    has_unlimited_generations: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    subscription_provider: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscription_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscription_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscriptionStartDate: { // New field for subscription start date
      type: DataTypes.DATE,
      allowNull: true,
    },
    subscriptionEndDate: { // New field for subscription end date
      type: DataTypes.DATE,
      allowNull: true,
    },
    promoCodeId: { // New field for promo code
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'PromoCodes', // This is the table name, not the model name
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Products',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'User',
    freezeTableName: true,
    tableName: 'Users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  });

  return User;
};