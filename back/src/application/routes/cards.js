const {Router} = require("express");
const {cardServiceContainer} = require("../../domain/services/CardService");
const postCardRequest = require('../adapters/postCardRequest')
const postCardResponse = require('../adapters/postCardResponse')
const getCardResponse = require('../adapters/getCardResponse')
const getCardRequest = require('../adapters/getCardRequest')
const getQuizzRequest = require('../adapters/getQuizzRequest')
const getQuizzResponse = require('../adapters/getQuizzResponse')
const patchCardAnswerRequest = require('../adapters/patchCardAnswerRequest')
const {quizzServiceContainer} = require("../../domain/services/QuizzService");

module.exports = () => {
    const router = new Router();

    router.get("/", (req, res) => {
        const CardService = req.container.resolve(cardServiceContainer);
        const request = getCardRequest(req);
        const cards = CardService.getCards(request.tags);
        res.json(getCardResponse(cards));
    });

    router.post("/", (req, res) => {
        const CardService = req.container.resolve(cardServiceContainer);
        const cardUserData = postCardRequest(req);
        const createdCard = CardService.addCard(cardUserData);
        res.status(201).json(postCardResponse(createdCard));
    });

    router.get("/quizz", (req, res) => {
        const QuizzService = req.container.resolve(quizzServiceContainer);
        const {date} = getQuizzRequest(req);
        const cards = QuizzService.getQuizz(date);
        res.json(getQuizzResponse(cards));
    });

    router.patch("/:id/answer", (req, res) => {
        const CardService = req.container.resolve(cardServiceContainer);
        const {card, isValid} = patchCardAnswerRequest(req);
        CardService.answerCard(card, isValid);
        res.sendStatus(204);
    })

    return router;
};