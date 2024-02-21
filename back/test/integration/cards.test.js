const request = require('supertest');
const app = require('../../server');
const StorageConnector = new (require('../../src/application/connectors/StorageConnector'));

const generateCards = (amount) => {
    const Card = require('../../src/domain/entities/Card');
    const cards = [];
    for (let i = 0; i < amount; i++) {
        cards.push(new Card(`id-${i + 1}`, 'How are you ?', 'I am fine', 'Test' + i));
    }
    return cards;
};

jest.mock('../../src/storage/storage', () => {
    return {
        cards: generateCards(2),
        users: [],
    };
});

describe('/cards test', () => {
    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });

    it('GET should return array with two cards', async () => {
        const response = await request(app)
            .get('/cards')
            .set('content-type', 'application/json')
            .send();

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('category');
        expect(response.body[0]).toHaveProperty('question');
        expect(response.body[0]).toHaveProperty('answer');
        expect(response.body[0]).toHaveProperty('tag');
    });

    it('GET should return cards with provided tag', async () => {
        const response = await request(app)
            .get('/cards?tags=Test0')
            .set('content-type', 'application/json')
            .send();

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].tag).toBe('Test0');
    });

    it('GET /quizz should return array with two cards', async () => {
        const response = await request(app)
            .get('/cards/quizz')
            .set('content-type', 'application/json')
            .send();

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('category');
        expect(response.body[0]).toHaveProperty('question');
        expect(response.body[0]).toHaveProperty('answer');
        expect(response.body[0]).toHaveProperty('tag');
    });

    it('POST /:id/answer should return 204', async () => {
        const card = StorageConnector.getCards()[0];
        const response = await request(app)
            .patch(`/cards/${card.id}/answer`)
            .set('content-type', 'application/json')
            .send({ isValid: true });

        expect(response.status).toBe(204);
    });

    it('POST /:id/answer should return 404', async () => {
        const response = await request(app)
            .patch('/cards/100/answer')
            .set('content-type', 'application/json')
            .send({ isValid: true });

        expect(response.status).toBe(404);
    });

    it('POST /:id/answer should return 403', async () => {
        const card = StorageConnector.getCards()[0];
        const response = await request(app)
            .patch(`/cards/${card.id}/answer`)
            .set('content-type', 'application/json')
            .send({ dummyVar: true });

        expect(response.status).toBe(403);
    });

    it('POST should return created card', async () => {
        const payload = {
            question: 'What is testing ?',
            answer: 'A way to insure your app stability',
            tag: 'Test',
        };

        const response = await request(app)
            .post('/cards')
            .set('Content-Type', 'application/json')
            .send(payload);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('category');
        expect(response.body).toHaveProperty('question');
        expect(response.body).toHaveProperty('answer');
        expect(response.body).toHaveProperty('tag');
        expect(response.body.question).toBe(payload.question);
        expect(response.body.answer).toBe(payload.answer);
        expect(response.body.tag).toBe(payload.tag);
    });

    it('POST should return 422', async () => {
        const payload = {
            answer: 'A way to insure your app stability',
            tag: 'Test',
        };

        const response = await request(app)
            .post('/cards')
            .set('Content-Type', 'application/json')
            .send(payload);

        expect(response.status).toBe(422);
    });
});
