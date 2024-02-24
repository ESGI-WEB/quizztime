module.exports = class Room {
    constructor(owner, quiz) {
        this.id = Math.random().toString(36).substring(7);
        this.owner = owner;
        this.quiz = quiz;
        this.currentQuestion = 0;
        this.quizStarted = false;
        this.currentQuestionAnswers = [];
    }
}