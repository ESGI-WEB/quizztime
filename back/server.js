const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8080;
const socketPort = process.env.SOCKET_PORT || 8081;
const host = process.env.SERVER_HOST || 'http://localhost';
const helloRouter = require('./src/routes/hello')();
const loginRouter = require('./src/routes/login')();
const usersRouter = require('./src/routes/users')();
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const cors = require("cors");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});
const roomService = require('./src/services/roomService');

app.use(cors());
app.use(express.json());

// Routes
app.use('/', helloRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/users', usersRouter);

// Socket
const rooms = [];

io.on('connection', (socket) => {
    socket.on('create-room', async ({quizId}) => {
        rooms.push(await roomService.createRoom(quizId, socket));
    });

    socket.on('join-room', ({roomId}) => {
        roomService.joinRoom(rooms, roomId, socket, io);
    });
});

// Middlewares
app.use(errorMiddleware);

// Start server
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Listening at ${host}:${port}`);
    });
    server.listen(socketPort, () => {
        console.log(`Socket listening at ${host}:${socketPort}`);
    });
}

module.exports = app;
