const {PrismaClient} = require("@prisma/client");
const Room = require("../entities/room");

const TIME_TO_ANSWER = 20 * 1000;

module.exports = {
    createRoom: async (quizId, owner, io) => {
        const prisma = new PrismaClient();
        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId,
            },
            include: {
                questions: {
                    include: {
                        choices: true
                    }
                }
            }
        });

        if (!quiz) {
            owner.emit('error', 'Quiz not found');
            await prisma.$disconnect();
            return;
        }

        const room = new Room(owner, quiz);
        owner.join(room.id);
        owner.emit('room-created', {id: room.id, quizId: quizId});
        owner.emit('room-updated', {
            'size': io.sockets.adapter.rooms.get(room.id).size
        });
        await prisma.$disconnect();
        return room;
    },

    joinRoom: (rooms, socketsData, roomId, name, socket, io) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) {
            socket.emit('error', 'Room not found');
            return;
        }

        if (room.quizStarted) {
            socket.emit('error', 'The quiz has already started');
            return;
        }

        // get names duplicated
        const socketsWithSameName = socketsData.filter(s => s.name === name && s.socketId !== socket.id);
        // check duplicates are not in the same room
        if (socketsWithSameName.some(s => io.sockets.adapter.rooms.get(room.id)?.has(s.socketId))) {
            socket.emit('error', 'Name already taken in this room');
            return;
        }

        const dataIndexToUpdate = socketsData.findIndex(s => s.socketId === socket.id);
        if (dataIndexToUpdate > -1) {
            socketsData[dataIndexToUpdate].name = name;
        } else {
            socketsData.push({socketId: socket.id, name});
        }

        // remove all rooms from the socket
        for (const room of socket.rooms) {
            socket.leave(room);
        }

        socket.join(room.id);
        socket.emit('room-joined', {id: room.id, quizId: room.quiz.id});
        io.to(room.id).emit('room-updated', {
            'size': io.sockets.adapter.rooms.get(room.id).size
        });
        return room;
    },

    hasJoinedRooms: (rooms, socket, io, callback) => {
        const socketRoomsJoined = rooms.find(
            room => io.sockets.adapter.rooms.get(room.id)?.has(socket.id)
        )

        if (!socketRoomsJoined) {
            callback(null);
            return;
        }

        callback({
            id: socketRoomsJoined.id,
            quizId: socketRoomsJoined.quiz.id,
        });
    },

    startQuiz: (room, io) => {
        io.to(room.id).emit('quiz-started');
        room.currentQuestion = 0;
        room.quizStarted = true;
        module.exports.sendCurrentQuestion(room, io, TIME_TO_ANSWER);

        setTimeout(() => {
            module.exports.sendNextQuestion(room, io);
        }, TIME_TO_ANSWER);
    },

    sendNextQuestion: (room, io) => {
        room.currentQuestion++;
        if (room.currentQuestion >= room.quiz.questions.length) {
            io.to(room.id).emit('quiz-ended');
            module.exports.saveAnswers(room).then(() => {
                // TODO emit results to owner
            });
            return;
        }

        module.exports.sendCurrentQuestion(room, io, TIME_TO_ANSWER);
        setTimeout(() => {
            module.exports.sendNextQuestion(room, io);
        }, TIME_TO_ANSWER);
        module.exports.saveAnswers(room); // pas d'await pour ne pas bloquer les events
    },

    sendCurrentQuestion: (room, io, timeToAnswer) => {
        const question = room.quiz.questions[room.currentQuestion];
        io.to(room.id).emit('question', {
            timeToAnswer: timeToAnswer,
            question: question.question,
            choices: question.choices.map(c => ({
                id: c.id,
                choice: c.choice
            })),
        });
    },

    answer: (choiceId, extraData, rooms, socket, io) => {
        const room = rooms.find(
            room => io.sockets.adapter.rooms.get(room.id)?.has(socket.id)
        );

        if (!room) {
            socket.emit('error', 'You are not in a room');
            return;
        }

        if (!room.quizStarted) {
            socket.emit('error', 'The quiz has not started yet');
            return;
        }

        const question = room.quiz.questions[room.currentQuestion];
        const choice = question.choices.find(c => c.id === choiceId);
        if (!choice) {
            socket.emit('error', 'Choice not found');
            return;
        }

        // create or update answer from room.currentQuestionAnswers
        const answerIndex = room.currentQuestionAnswers
            .findIndex(a => a.socketId === extraData.socketId);

        if (answerIndex > -1) {
            room.currentQuestionAnswers[answerIndex].choiceId = choiceId;
        } else {
            room.currentQuestionAnswers.push({
                socketId: extraData.socketId,
                userName: extraData.name,
                choiceId: choiceId,
                questionId: question.id
            });
        }
    },

    saveAnswers: async (room) => {
        if (room.currentQuestionAnswers.length <= 0) {
            return;
        }
        const prisma = new PrismaClient();
        await prisma.answer.createMany({
            data: room.currentQuestionAnswers
        });
        await prisma.$disconnect();
    }
}