interface Choice {
    id?: number;
    choice: string;
    isCorrect: boolean;
    question?: Question;
    questionId?: number;
}