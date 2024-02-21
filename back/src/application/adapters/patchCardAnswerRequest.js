const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const {cardServiceContainer} = require("../../domain/services/CardService");
const Category = require("../../domain/entities/Category");

module.exports = (req) => {
    const {params, body} = req;

    if (!params.id || typeof params.id !== 'string') {
        throw new ForbiddenError('Id is required and must be a string')
    }

    if (!('isValid' in body)) {
        throw new ForbiddenError('isValid is required')
    }

    if (typeof body.isValid !== 'boolean') {
        throw new ForbiddenError('isValid must be a boolean')
    }

    const CardService = req.container.resolve(cardServiceContainer);
    const card = CardService.findCardById(params.id);
    if (!card) {
        throw new NotFoundError('Card not found')
    }

    if (card.category === Category.DONE) {
        throw new ForbiddenError('Card is already done')
    }

    return {
        card: card,
        isValid: body.isValid
    }
}