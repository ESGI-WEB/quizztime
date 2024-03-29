const {Router} = require("express");
const quizService = require("../services/quizService");

module.exports = () => {
  const router = new Router();

  router.get("/", async function (req, res, next) {
    try {
      res.send(await quizService.getQuizzes(req.user))
    } catch (e) {
      next(e);
    }
  });

  router.post("/", async function (req, res, next) {
    try {
      res.send(await quizService.createQuiz(req.user, req.body))
    } catch (e) {
      next(e);
    }
  });

  return router;
};