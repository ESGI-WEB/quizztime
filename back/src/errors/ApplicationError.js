class ApplicationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ApplicationError';
        this.status = 400;
    }
}

module.exports = ApplicationError;