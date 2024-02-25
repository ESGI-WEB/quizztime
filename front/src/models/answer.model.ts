import {Choice} from "./choice.model";
import {Question} from "./question.model";

export interface Answer {
    id?: number;
    userName: string;
    socketId: string;
    question?: Question;
    questionId: number;
    choice?: Choice;
    choiceId: number;
}