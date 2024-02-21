const CardUserData = require("../entities/CardUserData");
const Card = require("../entities/Card");
const ServiceError = require('./errors/ServiceError');
const Category = require("../entities/Category");
const CategoryService = new (require('./CategoryService'));

class CardService {
    constructor({ storageConnector }) {
        this.storageConnector = storageConnector;
    }

    getCards(tags = null) {
        return tags?.length > 0 ? this.storageConnector.findCardsByTags(tags) : this.storageConnector.getCards();
    }

    addCard(cardData) {
        if (!(cardData instanceof CardUserData)) {
            throw new ServiceError('Card must be a CardUserData entity');
        }
        return this.storageConnector.addCard(cardData);
    }

    findCardById(id) {
        return this.storageConnector.findCardById(id);
    }

    answerCard(card, isValid) {
        if (!(card instanceof Card)) {
            throw new ServiceError('Card must be a Card entity');
        }

        const cardToSave = isValid ? this.markCardAsValid(card) : this.markCardAsInvalid(card);
        return this.storageConnector.updateCard(cardToSave);
    }

    markCardAsValid(card) {
        card.category = CategoryService.getNextCategoryFrom(card.category);
        card.lastAnsweredDate = new Date();
        return card;
    }

    markCardAsInvalid(card) {
        card.category = Category.FIRST;
        card.lastAnsweredDate = new Date();
        return card;
    }
}

module.exports = {
    CardService,
    cardServiceContainer: "cardService"
}