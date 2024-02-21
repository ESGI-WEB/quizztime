const {Router} = require("express");
const userService = require("../services/userService");

module.exports = () => {
    const router = new Router();

    router.post("/", async (req, res, next) => {
        try {
            const {email, password} = req.body;
            const token = await userService.login(email, password)
            res.send({token});
        } catch (e) {
            next(e);
        }
    });

    return router;
};