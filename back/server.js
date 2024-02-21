const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8080;
const host = process.env.SERVER_HOST || 'http://localhost';
const cardsRouter = require('./src/application/routes/cards')();
const errorMiddleware = require('./src/application/middlewares/errorMiddleware');
const { createContainer, asClass } = require('awilix');
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Dependency Injection
const container = createContainer();
container.register({
  cardService: asClass(require('./src/domain/services/CardService').CardService),
  quizzService: asClass(require('./src/domain/services/QuizzService').QuizzService),
  storageConnector: asClass(require('./src/application/connectors/StorageConnector')).singleton(),
});
app.use((req, res, next) => {
  req.container = container.createScope();
  next();
});

// Routes
app.use('/cards', cardsRouter);

app.use(errorMiddleware);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Listening at ${host}:${port}`);
  });
}

module.exports = app;
