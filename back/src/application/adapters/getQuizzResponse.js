const cardResponse = require('./cardResponse');

module.exports = (cards) => {
    return cards.map(card => cardResponse(card));
}