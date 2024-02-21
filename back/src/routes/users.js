const {Router} = require("express");
const userService = require("../services/userService");

module.exports = () => {
    const router = new Router();

    router.post("/", async function (req, res, next) {
        try {
            const data = req.body;
            data.role = 'USER';

            const user = await userService.create(data);

            res.status(201).json({
                ...userService.format(user),
                token: userService.generateToken(user)
            });
        } catch (e) {
            next(e);
        }
    });

    return router;
};