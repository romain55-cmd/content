'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    static associate(models) {
      // Content belongs to a User
      Content.belongsTo(models.User, {
        foreignKey: 'userId', // Assuming you add a userId foreign key
        as: 'author'
      });
    }
  }

  Content.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: { // Foreign key for the User
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashtags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    target_audience: {
      type: DataTypes.STRING,
    },
    generation_prompt: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'draft',
    },
    scheduled_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Content',
    tableName: 'Contents',
    freezeTableName: true,
  });

  return Content;
};