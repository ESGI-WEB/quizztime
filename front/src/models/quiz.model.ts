import {Question} from "./question.model";

export interface Quiz {
    id?: number;
    title: string;
    questions: Question[];
    passcode?: string;
    maxUsers?: number;
}