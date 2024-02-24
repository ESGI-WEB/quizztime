const jwt = require("jsonwebtoken");
const {PrismaClient} = require("@prisma/client");

module.exports = (roles = []) => {
    if (roles && !Array.isArray(roles)) {
        roles = [roles]
    }

    return async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            if (!token) return res.status(401).send("No token provided.");

            const jwtData = jwt.verify(token, process.env.JWT_SECRET); // will throw an error if the token is invalid

            const prisma = new PrismaClient();
            const user = await prisma.user.findUnique({
                where: {
                    id: jwtData.id
                }
            });
            await prisma.$disconnect();

            if (!user) return res.status(401).send("User not found.");
            if (user.role !== jwtData.role) return res.status(401).send("Role has changed since the token was created.");

            req.user = user; // make sure that we have live data from the database

            if (roles && roles.length > 0 && !roles.includes(req.user.role)) return res.sendStatus(403); // role is not allowed

            next();
        } catch (error) {
            console.error(error);
            res.sendStatus(401);
        }
    };
};