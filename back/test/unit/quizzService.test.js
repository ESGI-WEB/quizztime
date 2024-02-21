const storageConnector = new (require('../../src/application/connectors/StorageConnector'));
const Card = require('../../src/domain/entities/Card');
const {QuizzService: QuizzServiceClass} = require("../../src/domain/services/QuizzService");
const QuizzService = new QuizzServiceClass({ storageConnector });
const Category = require('../../src/domain/entities/Category');

const generateCards = (amount) => {
    const cards = [];
    for (let i = 0; i < amount; i++) {
        cards.push(new Card(i, 'How are you ?', 'I am fine'));
    }
    return cards;
}

describe('Quizz Service test', () => {

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should return empty array', () => {
        jest.spyOn(storageConnector, "getCards").mockReturnValue([]);

        const cards = QuizzService.getQuizz();
        expect(cards).toBeInstanceOf(Array);
        expect(cards).toHaveLength(0);
    });

    it('should return array with one card', () => {
        jest.spyOn(storageConnector, "getCards").mockReturnValue(generateCards(1));

        const cards = QuizzService.getQuizz();
        expect(cards).toBeInstanceOf(Array);
        expect(cards).toHaveLength(1);
    });

    it('should return array with two cards', () => {
        jest.spyOn(storageConnector, "getCards").mockReturnValue(generateCards(2));

        const cards = QuizzService.getQuizz();
        expect(cards).toBeInstanceOf(Array);
        expect(cards).toHaveLength(2);
    });

    it('should return cards never answered', () => {
        const today = new Date('2021-01-01');

        jest.spyOn(storageConnector, "getCards").mockReturnValue([
            new Card('1', 'How are you ?', 'I am fine'),
        ]);

        const cards = QuizzService.getQuizz(today);
        expect(cards).toBeInstanceOf(Array);
        expect(cards).toHaveLength(1);
    });

    it('should return cards of category FIRST', () => {
        const yesterday = new Date('2021-01-01');
        const today = new Date('2021-01-02');

        jest.spyOn(storageConnector, "getCards").mockReturnValue([
            new Card('1', 'How are you ?', 'I am fine', null, Category.FIRST, yesterday),
        ]);

        const cards = QuizzService.getQuizz(today);
        expect(cards).toBeInstanceOf(Array);
        expect(cards).toHaveLength(1);
    });

    it('should return cards of category SECOND', () => {
        const today = new Date('2021-01-02');
        const twoDaysBefore = new Date('2020-12-31');

        jest.spyOn(storageConnector, "getCards").mockReturnValue([
            new Card('1', 'How are you ?', 'I am fine', null, Category.SECOND, twoDaysBefore),
        ]);

        const cards = QuizzService.getQuizz(today);
        expect(cards).toBeInstanceOf(Array);
        expect(cards).toHaveLength(1);
    });

    it('should return cards of category SECOND OR FIRST', () => {
        const today = new Date('2021-01-02');
        const twoDaysBefore = new Date('2020-12-31');
        const fiveDaysBefore = new Date('2020-12-28');
        const yesterday = new Date('2021-01-01');

        const cardsExpected = [
            new Card('1', 'How are you ?', 'I am fine', null, Category.SECOND, twoDaysBefore),
            new Card('2', 'How are you ?', 'I am fine', null, Category.SECOND, fiveDaysBefore),
            new Card('3', 'How are you ?', 'I am fine', null, Category.FIRST, yesterday),
            new Card('4', 'How are you ?', 'I am fine', null, Category.FIRST, twoDaysBefore),
        ];

        const cardsNotExpected = [
            new Card('11', 'How are you ?', 'I am fine', null, Category.FIRST, today),
            new Card('12', 'How are you ?', 'I am fine', null, Category.SECOND, today),
            new Card('13', 'How are you ?', 'I am fine', null, Category.SECOND, yesterday),
        ];

        jest.spyOn(storageConnector, "getCards").mockReturnValue([...cardsExpected, ...cardsNotExpected]);

        const cards = QuizzService.getQuizz(today);
        expect(cards).toBeInstanceOf(Array);
        expect(cards).toHaveLength(4);
        expect(cards).toEqual(cardsExpected);
    });

    it('should return cards of category FIFTH OR SECOND OR FIRST', () => {
        const today = new Date('2021-01-02');
        const twoDaysBefore = new Date('2020-12-31');
        const sixteenDaysBefore = new Date('2020-12-17');
        const yesterday = new Date('2021-01-01');
        const onMonthBefore = new Date('2020-12-02');

        const cardsExpected = [
            new Card('1', 'How are you ?', 'I am fine', null, Category.FIFTH, sixteenDaysBefore),
            new Card('2', 'How are you ?', 'I am fine', null, Category.FIFTH, onMonthBefore),
            new Card('3', 'How are you ?', 'I am fine', null, Category.SECOND, twoDaysBefore),
            new Card('4', 'How are you ?', 'I am fine', null, Category.FIRST, yesterday),
            new Card('5', 'How are you ?', 'I am fine', null, Category.FIRST, sixteenDaysBefore),
        ];

        const cardsNotExpected = [
            new Card('11', 'How are you ?', 'I am fine', null, Category.FIRST, today),
            new Card('12', 'How are you ?', 'I am fine', null, Category.FIFTH, twoDaysBefore),
            new Card('13', 'How are you ?', 'I am fine', null, Category.SECOND, today),
            new Card('14', 'How are you ?', 'I am fine', null, Category.SECOND, yesterday),
            new Card('15', 'How are you ?', 'I am fine', null, Category.FIFTH, today),
        ];

        jest.spyOn(storageConnector, "getCards").mockReturnValue([...cardsExpected, ...cardsNotExpected]);

        const cards = QuizzService.getQuizz(today);
        expect(cards).toBeInstanceOf(Array);
        expect(cards).toHaveLength(5);
        expect(cards).toEqual(cardsExpected);
    });

    it('should return empty array if category is DONE', function () {
        const today = new Date('2021-01-02');
        const yesterday = new Date('2021-01-01');

        jest.spyOn(storageConnector, "getCards").mockReturnValue([
            new Card('1', 'How are you ?', 'I am fine', null, Category.DONE, yesterday),
        ]);

        const cards = QuizzService.getQuizz(today);
        expect(cards).toBeInstanceOf(Array);
        expect(cards).toHaveLength(0);
    });

    it('should return cards of category FIRST but not of category DONE', function () {
        const today = new Date('2021-01-02');
        const yesterday = new Date('2021-01-01');

        jest.spyOn(storageConnector, "getCards").mockReturnValue([
            new Card('1', 'How are you ?', 'I am fine', null, Category.DONE, yesterday),
            new Card('2', 'How are you ?', 'I am fine', null, Category.FIRST, yesterday),
        ]);

        const cards = QuizzService.getQuizz(today);
        expect(cards).toBeInstanceOf(Array);
        expect(cards).toHaveLength(1);
    });

});