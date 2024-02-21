import {Category} from "./Category";

export interface Card {
    id: string;
    category: Category;
    question: string;
    answer: string;
    tag: string;
}