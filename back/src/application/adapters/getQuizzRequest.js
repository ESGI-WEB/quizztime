const ForbiddenError = require('../errors/ForbiddenError');

module.exports = (req) => {
    const query = req.query;
    if (query.date && query.date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) === null) {
        throw new ForbiddenError('Invalid date format');
    }
    return {
        date: new Date(query.date ?? null),
    }
}