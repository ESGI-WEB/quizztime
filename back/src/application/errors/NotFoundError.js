const ApplicationError = require('./ApplicationError');

class NotFoundError extends ApplicationError {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.status = 404;
    }
}

module.exports = NotFoundError;