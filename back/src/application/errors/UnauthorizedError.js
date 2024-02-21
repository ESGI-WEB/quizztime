const ApplicationError = require('./ApplicationError');

class UnauthorizedError extends ApplicationError {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
        this.status = 401;
    }
}

module.exports = UnauthorizedError;