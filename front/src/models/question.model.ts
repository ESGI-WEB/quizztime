import {Choice} from "./choice.model";
import {Answer} from "./answer.model";
import {Quiz} from "./quiz.model";

export interface Question {
    id?: number;
    question?: string;
    choices?: Choice[];
    quiz?: Quiz;
    quizId?: number;
    answers?: Answer[];
    timeToAnswer?: number;
}