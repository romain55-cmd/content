const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, 'secret', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
