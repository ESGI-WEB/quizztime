export interface Result {
    choiceId: number;
    choice: string;
    numberOfRightAnswers: number;
    namesByResults: {
        name: string;
        choiceId: number;
        isRight: boolean;
    }[]
}