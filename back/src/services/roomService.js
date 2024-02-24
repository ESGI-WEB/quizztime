const {PrismaClient} = require("@prisma/client");
const Room = require("../entities/room");
module.exports = {
    createRoom: async (quizId, owner) => {
        const prisma = new PrismaClient();
        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId,
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
        await prisma.$disconnect();
        return room;
    },

    joinRoom: (rooms, socketsData, roomId, name, socket, io) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) {
            socket.emit('error', 'Room not found');
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
    }
}