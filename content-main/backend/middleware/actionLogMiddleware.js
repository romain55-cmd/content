const { ActionLog } = require('../models');

const logAction = (action, details = {}) => (req, res, next) => {
  if (req.user) {
    ActionLog.create({
      userId: req.user.id,
      action,
      details,
    }).catch(err => {
      console.error('Failed to log action:', err);
    });
  }
  next();
};

module.exports = { logAction };
