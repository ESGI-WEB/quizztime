const {Router} = require("express");
const HelloService = require("../services/helloService");

module.exports = () => {
    const router = new Router();

    router.get("/", (req, res) => {
        res.send(HelloService.sayHello());
    });

    return router;
};