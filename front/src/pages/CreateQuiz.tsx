import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import CreateQuestion from "../components/CreateQuestion.tsx";

export default function CreateQuiz() {
    const initialQuestion = {
        id: 1,
        question: "",
        choices: [],
        quizId: 1,
        answers: [],
    };

    const [questions, setQuestions] = useState([initialQuestion]);

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], question: value };
        setQuestions(newQuestions);
    };

    const handleChoiceChange = (questionIndex, choiceIndex, value) => {
        const newQuestions = [...questions];
        const newChoices = [...newQuestions[questionIndex].choices];
        newChoices[choiceIndex] = value;
        newQuestions[questionIndex] = { ...newQuestions[questionIndex], choices: newChoices };
        setQuestions(newQuestions);
    };

    const handleAddChoice = (index) => {
        const newQuestions = [...questions];
        const newChoices = [...newQuestions[index].choices, ""];
        newQuestions[index] = { ...newQuestions[index], choices: newChoices };
        setQuestions(newQuestions);
    };

    const handleDeleteChoice = (questionIndex, choiceIndex) => {
        const newQuestions = [...questions];
        const newChoices = [...newQuestions[questionIndex].choices];
        newChoices.splice(choiceIndex, 1);
        newQuestions[questionIndex] = { ...newQuestions[questionIndex], choices: newChoices };
        setQuestions(newQuestions);
    };

    const handleAnswerChange = (index, choiceIndex, checked) => {
        const newQuestions = [...questions];
        const currentChoices = newQuestions[index].choices;
        const selectedChoice = currentChoices[choiceIndex];
        const currentAnswers = newQuestions[index].answers;

        const updatedAnswers = checked
            ? [...currentAnswers, { index: choiceIndex, label: selectedChoice }]
            : currentAnswers.filter((answer) => answer.index !== choiceIndex);

        newQuestions[index] = { ...newQuestions[index], answers: updatedAnswers };
        setQuestions(newQuestions);
    };


    const addQuestion = () => {
        console.log(questions)
        const newQuestion = {
            id: questions.length + 1,
            question: "",
            choices: [],
            quizId: 1,
            answers: [],
        };
        setQuestions([...questions, newQuestion]);
    };

    return (
        <form className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto">
            {questions.map((question, index) => (
                <CreateQuestion
                    key={index}
                    index={index}
                    question={question}
                    onChangeQuestion={handleQuestionChange}
                    onChangeChoice={handleChoiceChange}
                    onAddChoice={handleAddChoice}
                    onDeleteChoice={handleDeleteChoice}
                    onChangeAnswer={handleAnswerChange}
                />
            ))}
            <Button variant="contained" onClick={addQuestion}>
                Ajouter une question
            </Button>
        </form>
    );
}
