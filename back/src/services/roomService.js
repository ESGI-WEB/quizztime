const {PrismaClient} = require("@prisma/client");
const Room = require("../entities/room");
const {shuffle} = require("../helpers");

module.exports = {
    findSocketRoom: (rooms, socket, io) => {
        return rooms.find(
            room => io.sockets.adapter.rooms.get(room.id)?.has(socket.id)
        );
    },

    getRoomData: (room, socketsData, io) => {
        const sockets = io.sockets.adapter.rooms.get(room.id);
        const participants = [];
        if (sockets) {
            for (const socketId of sockets) {
                if (socketId === room.owner.id) {
                    continue;
                }

                const extraData = socketsData.find(s => s.socketId === socketId);
                if (!extraData) {
                    continue;
                }

                participants.push(extraData.name);
            }
        }

        const currentQuestion = room.quiz.questions[room.currentQuestion];

        return {
            size: io.sockets.adapter.rooms.get(room.id).size,
            participants,
            currentQuestion: {
                question: currentQuestion.question,
                id: currentQuestion.id,
                timeToAnswer: room.timeToAnswer,
            }
        };
    },

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
                },
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

    joinRoom: async (rooms, socketsData, roomId, name, socket, io, passcode) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) {
            socket.emit('error', 'Room not found');
            return;
        }

        if (room.quizStarted) {
            socket.emit('error', 'The quiz has already started');
            return;
        }

        if (room.quiz.passcode !== null) {
            const bcrypt = require('bcryptjs');
            const hashedPasscode = room.quiz.passcode;
            const isPasscodeCorrect = await bcrypt.compare(passcode, hashedPasscode);
            if (!isPasscodeCorrect) {
                socket.emit('error', 'Wrong password');
                return;
            }
        }

        if (room.quiz.maxUsers > 0 && io.sockets.adapter.rooms.get(room.id).size > room.quiz.maxUsers) { // > to not count the owner
            socket.emit('error', 'Room is full');
            return;
        }

        const socketsWithSameName = socketsData.filter(s => s.name === name && s.socketId !== socket.id);
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
        const socketRoomsJoined = module.exports.findSocketRoom(rooms, socket, io);

        if (!socketRoomsJoined) {
            callback(null);
            return;
        }

        callback({
            id: socketRoomsJoined.id,
            quizId: socketRoomsJoined.quiz.id,
        });
    },

    sendMessage: (message, rooms, io, socket, socketsData) => {
        if (message.trim()) {
            const room = rooms.find(room => io.sockets.adapter.rooms.get(room.id)?.has(socket.id));
            if (room) {
                const question = room.quiz.questions[room.currentQuestion];
                const choices = question.choices;
                const isMessageChoice = choices.some(choice => message.includes(choice.choice));
                if (isMessageChoice) {
                    socket.emit('error', 'Choice in message');
                    return;
                }
                const userSocketData = socketsData.find(s => s.socketId === socket.id);
                if (userSocketData) {
                    const { name } = userSocketData;
                    const messageWithPseudo = `${name}: ${message}`;
                    io.to(room.id).emit('server-chat-message', messageWithPseudo);
                } else {
                    socket.emit('error', 'User data not found');
                }
            } else {
                socket.emit('error', 'Not in a room');
            }
        } else {
            socket.emit('error', 'Empty message');
        }
    },

    startQuiz: (room, io) => {
        io.to(room.id).emit('quiz-started');
        room.currentQuestion = 0;
        room.quizStarted = true;
        module.exports.sendCurrentQuestion(room, io, room.timeToAnswer);
    },

    sendNextQuestion: (room, socket, io) => {
        if (room.isAcceptingAnswers) {
            socket.emit('error', 'You cannot skip a question while the quiz is running');
            return;
        }

        room.currentQuestion++;
        module.exports.sendCurrentQuestion(room, io, room.timeToAnswer);
    },

    sendCurrentQuestion: (room, io, timeToAnswer) => {
        room.isAcceptingAnswers = true;
        room.timeToAnswer = timeToAnswer;

        const question = room.quiz.questions[room.currentQuestion];
        io.to(room.id).emit('question', {
            timeToAnswer: timeToAnswer,
            question: question.question,
            id: question.id,
            choices: shuffle(question.choices.map(c => ({
                id: c.id,
                choice: c.choice
            }))),
        });

        if (room.answerTimeout) {
            clearTimeout(room.answerTimeout);
        }

        room.answerTimeout = setTimeout(() => {
            room.isAcceptingAnswers = false;
            module.exports.sendQuestionResult(room, io);
        }, timeToAnswer);
    },

    sendQuestionResult: (room, io) => {
        const question = room.quiz.questions[room.currentQuestion];
        const rightChoice = question.choices.find(c => c.isCorrect);
        const numberOfRightAnswers = room.currentQuestionAnswers
            .filter(a => a.choiceId === rightChoice.id).length;
        const namesByResults = room.currentQuestionAnswers
            .map(a => ({
                name: a.userName,
                choiceId: a.choiceId,
                isRight: a.choiceId === rightChoice.id
            }));

        io.to(room.id).emit('question-result', {
            choiceId: rightChoice.id,
            choice: rightChoice.choice,
            numberOfRightAnswers,
            namesByResults,
        });

        const ended = module.exports.shouldSendQuizEnded(room, io);
        module.exports.saveAnswers(room.currentQuestionAnswers, ended, io, room); // pas d'await pour ne pas bloquer les events
        room.currentQuestionAnswers = [];
    },

    shouldSendQuizEnded: (room, io) => {
        if (room.currentQuestion + 1 >= room.quiz.questions.length) {
            io.to(room.id).emit('quiz-ended');
            return true;
        }
        return false;
    },

    answer: (choiceId, extraData, rooms, socket, io) => {
        const room = module.exports.findSocketRoom(rooms, socket, io);

        if (!room) {
            socket.emit('error', 'You are not in a room');
            return;
        }

        if (!room.quizStarted) {
            socket.emit('error', 'The quiz has not started yet');
            return;
        }

        if (!room.isAcceptingAnswers) {
            socket.emit('error', 'You cannot answer now');
            return;
        }

        const question = room.quiz.questions[room.currentQuestion];
        const choice = question.choices.find(c => c.id === choiceId);
        if (!choice) {
            socket.emit('error', 'Choice not found');
            return;
        }

        // create or update answer from room.currentQuestionAnswers
        let answerIndex = room.currentQuestionAnswers
            .findIndex(a => a.socketId === extraData.socketId);

        if (answerIndex > -1) {
            room.currentQuestionAnswers[answerIndex].choiceId = choiceId;
        } else {
            answerIndex = room.currentQuestionAnswers.push({
                socketId: extraData.socketId,
                userName: extraData.name,
                choiceId: choiceId,
                questionId: question.id
            }) - 1;
        }

        room.owner.emit('participant-answered', {
            ...room.currentQuestionAnswers[answerIndex],
            choice,
        });
    },

    saveAnswers: async (currentQuestionAnswers, emitResults = false, io = null, room = null) => {
        if (currentQuestionAnswers.length <= 0) {
            return;
        }
        const prisma = new PrismaClient();
        await prisma.answer.createMany({
            data: currentQuestionAnswers
        });
        await prisma.$disconnect();

        if (emitResults) {
            const socketsIdsAnswers = io.sockets.adapter.rooms.get(room.id);
            const answers = await prisma.answer.findMany({
                where: {
                    socketId: {
                        in: Array.from(socketsIdsAnswers)
                    }
                },
                include: {
                    question: true,
                    choice: true,
                }
            });
            io.to(room.id).emit('quiz-end-results', answers);
        }
    },

    setTimeToAnswer: (room, io, newTimeToAnswer) => {
        room.timeToAnswer = newTimeToAnswer;
        io.to(room.id).emit('update-time', { timeToAnswer: newTimeToAnswer });
        module.exports.sendCurrentQuestion(room, io, newTimeToAnswer);
    }
}