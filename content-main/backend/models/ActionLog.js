'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ActionLog extends Model {
    static associate(models) {
      ActionLog.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  ActionLog.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  }, {
    sequelize,
    modelName: 'ActionLog',
    updatedAt: false,
  });

  return ActionLog;
};