const {cards} = require('../../storage/storage');
const CardUserData = require("../../domain/entities/CardUserData");
const Card = require("../../domain/entities/Card");
const IncompatibleData = require("./errors/IncompatibleData");
const UnknownData = require("./errors/UnknownData");
const crypto = require("crypto");

module.exports = class StorageConnector {
    addCard(card) {
        if (!(card instanceof CardUserData)) {
            throw new IncompatibleData("CardUserData instance expected");
        }

        const cardToCreate = new Card(crypto.randomUUID(), card.question, card.answer, card.tag);
        cards.push(cardToCreate);

        return cardToCreate;
    }

    getCards() {
        return cards;
    }

    findCardsByTags(tags) {
        return this.getCards().filter(card =>
            card.tag &&
            tags.map(tag => tag.toLowerCase()).includes(card.tag.toLowerCase())
        );
    }

    findCardById(id) {
        return this.getCards().find(card => card.id === id);
    }

    updateCard(card) {
        if (!(card instanceof Card)) {
            throw new IncompatibleData("Card instance expected");
        }

        const index = this.getCards().findIndex(c => c.id === card.id);
        if (index === -1) {
            throw new UnknownData("Card not found");
        }

        cards[index] = card;

        return card;
    }
}