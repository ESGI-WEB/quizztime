const ApplicationError = require('./ApplicationError');

class UnprocessableEntityError extends ApplicationError {
    constructor(message) {
        super(message);
        this.name = 'UnprocessableEntityError';
        this.status = 422;
    }
}

module.exports = UnprocessableEntityError;