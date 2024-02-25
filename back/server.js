const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8080;
const socketPort = process.env.SOCKET_PORT || 8081;
const host = process.env.SERVER_HOST || 'http://localhost';
const helloRouter = require('./src/routes/hello')();
const loginRouter = require('./src/routes/login')();
const usersRouter = require('./src/routes/users')();
const quizzesRouter = require('./src/routes/quizzes')();
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
const auth = require("./src/middlewares/auth");

app.use(cors());
app.use(express.json());

// Routes
app.use('/', helloRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/quizzes', auth(), quizzesRouter);

// Socket
const rooms = [];
const socketsData = []; // {socketId: 'socketId', ...}

io.on('connection', (socket) => {
    console.log('Client connecté:', socket.id);

    socket.on('create-room', async ({quizId, name = 'Quiz Owner'}) => {
        // Todo add token verification
        rooms.push(await roomService.createRoom(quizId, socket, io, socketsData));

        const dataIndexToUpdate = socketsData.findIndex(s => s.socketId === socket.id);
        if (dataIndexToUpdate > -1) {
            socketsData[dataIndexToUpdate].name = name;
        } else {
            socketsData.push({socketId: socket.id, name});
        }
    });

    socket.on('join-room', ({name, roomId}) => {
        roomService.joinRoom(rooms, socketsData, roomId, name, socket, io);
    });

    socket.on('has-rooms-joined', (callback) => {
        roomService.hasJoinedRooms(rooms, socket, io, callback);
    });

    socket.on('chat-message', (message) => {
        if (message) {
            console.log("prepare to emit")
            const room = rooms.find(room => io.sockets.adapter.rooms.get(room.id)?.has(socket.id));
            if (room) {
                const userSocketData = socketsData.find(s => s.socketId === socket.id);
                if (userSocketData) {
                    const { name } = userSocketData;
                    const messageWithPseudo = `${name}: ${message}`;
                    io.to(room.id).emit('server-chat-message', messageWithPseudo);
                    console.log('Emitted server-chat-message event');
                } else {
                    console.log('User data not found');
                }

            }

        } else {
            console.log('User is not in a room');
        }
    });

    socket.on('get-room-size', (callback) => {
        const room = roomService.findSocketRoom(rooms, socket, io);

        if (room) {
            callback(io.sockets.adapter.rooms.get(room.id).size);
        }
    });

    socket.on('start-quiz', () => {
        const room = roomService.findSocketRoom(rooms, socket, io);

        if (!room) {
            socket.emit('error', 'You are not in a room');
            return;
        }

        if (socket.id !== room.owner.id) {
            socket.emit('error', 'You are not the owner of the room');
            return;
        }

        roomService.startQuiz(room, io);
    });

    socket.on('launch-next-question', () => {
        const room = roomService.findSocketRoom(rooms, socket, io);

        if (!room) {
            socket.emit('error', 'You are not in a room');
            return;
        }

        if (socket.id !== room.owner.id) {
            socket.emit('error', 'You are not the owner of the room');
            return;
        }

        roomService.sendNextQuestion(room, socket, io);
    });

    socket.on('answer', ({choiceId}) => {
        const extraData = socketsData.find(s => s.socketId === socket.id);
        roomService.answer(choiceId, extraData, rooms, socket, io);
    });

    socket.on('disconnecting', () => {
        // for each room of the socket
        // - check if room is empty to delete it from rooms
        // - if room is not empty, emit room-updated event
        for (const room of socket.rooms) {
            const roomSize = io.sockets.adapter.rooms.get(room).size - 1;
            if (roomSize === 0) {
                const index = rooms.findIndex(r => r.id === room);
                if (index > -1) {
                    rooms.splice(index, 1);
                }
            } else {
                io.to(room).emit('room-updated', {
                    'size': roomSize
                });
            }
        }

        // remove socket from socketsData
        const index = socketsData.findIndex(s => s.socketId === socket.id);
        if (index > -1) {
            socketsData.splice(index, 1);
        }
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
