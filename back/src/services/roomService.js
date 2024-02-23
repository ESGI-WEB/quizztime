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

    joinRoom: (rooms, roomId, socket, io) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) {
            socket.emit('error', 'Room not found');
            return;
        }

        socket.join(room.id);
        io.to(room.id).emit('room-updated', {
            'size': io.sockets.adapter.rooms.get(room.id).size
        });
        return room;
    },

    hasJoinedRooms: (rooms, socket, io, callback) => {
        const socketRoomsJoined = rooms.find(
            room => io.sockets.adapter.rooms.get(room.id)?.has(socket.id)
        )
        console.log({socketRoomsJoined});

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