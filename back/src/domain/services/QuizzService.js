const CategoryFrequency = require('../entities/CategoryFrequency');
const moment = require("moment");
const Category = require('../entities/Category');

class QuizzService {
    constructor({storageConnector}) {
        this.storageConnector = storageConnector;
    }

    getQuizz(date) {
        let cards = this.storageConnector.getCards();
        return cards.filter(card => this.shouldIncludeCard(card, date));
    }

    shouldIncludeCard(card, currentDate) {
        if (!card.lastAnsweredDate) {
            return true;
        }

        if (card.category === Category.DONE) {
            return false;
        }

        const daysToAdd = CategoryFrequency[card.category];
        const nextDateToAnswer = moment(card.lastAnsweredDate).add(daysToAdd, 'days');
        return nextDateToAnswer.isSameOrBefore(currentDate);
    }
}

module.exports = {
    QuizzService,
    quizzServiceContainer: "quizzService"
}