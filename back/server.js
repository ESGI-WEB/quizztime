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

io.on('connection', (socket) => {
    console.log('Client connecté:', socket.id); // Log de la connexion du client
    socket.on('create-room', async ({quizId}) => {
        rooms.push(await roomService.createRoom(quizId, socket));
    });

    socket.on('join-room', ({roomId}) => {
        roomService.joinRoom(rooms, roomId, socket, io);
    });

    socket.on('has-rooms-joined', (callback) => {
        roomService.hasJoinedRooms(rooms, socket, io, callback);
    });

    socket.on('chat-message', (message) => {
        console.log('Message reçu:', message);
        io.emit('server-chat-message', message);
    });

    socket.on('disconnecting', () => {
        // for each room of the socket
        // - check if room is empty to delete it from rooms
        // - if room is not empty, emit room-updated event
        for (const room of socket.rooms) {
            const roomSize = io.sockets.adapter.rooms.get(room).size;
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
