const { AuditLog } = require('../models');

const logAudit = (action) => async (req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    if (res.statusCode < 400) {
      AuditLog.create({
        userId: req.user.id,
        action: action,
        targetId: req.params.id || null,
        details: {
          body: req.body,
          query: req.query,
          params: req.params,
        }
      }).catch(err => {
        console.error('Failed to log audit:', err);
      });
    }
    originalSend.apply(res, arguments);
  };
  next();
};

module.exports = { logAudit };
