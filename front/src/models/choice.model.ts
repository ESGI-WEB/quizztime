import {Question} from "./question.model";

export interface Choice {
    id?: number;
    choice: string;
    isCorrect: boolean;
    question?: Question;
    questionId?: number;
}