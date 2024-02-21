const CardUserData = require('../../domain/entities/CardUserData');
const UnprocessableEntityError = require('../errors/UnprocessableEntityError');

module.exports = (req) => {
    const body = req.body;
    if (!body.question || typeof body.question !== 'string') {
        throw new UnprocessableEntityError('Question is required and must be a string')
    }
    if (!body.answer || typeof body.answer !== 'string') {
        throw new UnprocessableEntityError('Answer is required and must be a string')
    }
    if (body.tag && typeof body.tag !== 'string') {
        throw new UnprocessableEntityError('Tag must be a string or null')
    }
    return new CardUserData(body.question, body.answer, body.tag ?? null)
}