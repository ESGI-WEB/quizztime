interface Question {
    id: number;
    question: string;
    choices: Choice[];
    quiz: Quiz;
    quizId: number;
    answers: Answer[];
}