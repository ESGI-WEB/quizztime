const ApplicationError = require('./ApplicationError');

class ForbiddenError extends ApplicationError {
    constructor(message) {
        super(message);
        this.name = 'ForbiddenError';
        this.status = 403;
    }
}

module.exports = ForbiddenError;