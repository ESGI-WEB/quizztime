const Category = require('./Category');

class Card {
    constructor(id, question, answer, tag = null, category = Category.FIRST, lastAnsweredDate = null) {
        this.id = id;
        this.category = category;
        this.question = question;
        this.answer = answer;
        this.tag = tag;
        this.lastAnsweredDate = lastAnsweredDate;
    }
}

module.exports = Card;