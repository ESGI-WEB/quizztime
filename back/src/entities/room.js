module.exports = class Room {
    constructor(owner, quizz) {
        this.id = Math.random().toString(36).substring(7);
        this.owner = owner;
        this.quizz = quizz;
    }
}