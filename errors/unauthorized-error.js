const { AUTENTICATION_ERROR } = require('../utils/constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = AUTENTICATION_ERROR;
  }
}

module.exports = UnauthorizedError;
