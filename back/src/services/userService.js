const UnprocessableEntityError = require('../errors/unprocessableEntityError');
const UnauthorizedError = require('../errors/unauthorizedError');
const {PrismaClient} = require("@prisma/client");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET, {expiresIn: '7d'});
}

module.exports = {
    format: (user) => {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    },

    generateToken,

    login: async (email, password) => {
        if (!email || !password) {
            throw new UnprocessableEntityError('Email and password are required');
        }

        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({where: {email}});
        if (!user) {
            await prisma.$disconnect();
            throw new UnauthorizedError('Invalid credentials');
        }

        const bcrypt = require("bcryptjs");
        if (!bcrypt.compareSync(password, user.password)) {
            await prisma.$disconnect();
            throw new UnauthorizedError('Invalid credentials');
        }

        await prisma.$disconnect();
        return generateToken(user);
    },

    create: async (user) => {
        const prisma = new PrismaClient();

        if (await prisma.user.findUnique({where: {email: user.email}}) !== null) {
            await prisma.$disconnect();
            throw new UnprocessableEntityError('User already exists');
        }

        const bcrypt = require("bcryptjs");
        user.password = bcrypt.hashSync(user.password, 10);

        const userCreated = prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: user.password,
                role: user.role
            }
        });
        await prisma.$disconnect();
        return userCreated;
    }
}