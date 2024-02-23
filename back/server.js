const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8080;
const host = process.env.SERVER_HOST || 'http://localhost';
const helloRouter = require('./src/routes/hello')();
const loginRouter = require('./src/routes/login')();
const usersRouter = require('./src/routes/users')();
const quizzesRouter = require('./src/routes/quizzes')();
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Routes
app.use('/', helloRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/quizzes', quizzesRouter);

app.use(errorMiddleware);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Listening at ${host}:${port}`);
  });
}

module.exports = app;
