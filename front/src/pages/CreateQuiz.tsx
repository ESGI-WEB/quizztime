import {FormEvent, Fragment, useState} from "react";
import {Button, Divider, TextField} from "@mui/material";
import CreateQuestion from "../components/CreateQuestion.tsx";
import useQuizService from "../services/useQuizService";
import {useNavigate} from "react-router-dom";
import {Question} from "../models/question.model";

export default function CreateQuiz() {
    const initialQuestion: Question = {
        question: "",
        choices: [],
        answers: [],
    };

    const [questions, setQuestions] = useState([initialQuestion]);
    const [title, setTitle] = useState("");
    const [passcode, setPasscode] = useState("");
    const [maxUsers, setMaxUsers] = useState(0);
    const [saving, setSaving] = useState(false);
    const quizService = useQuizService();
    const navigate = useNavigate();

    const addQuestion = () => {
        setQuestions([...questions, initialQuestion]);
    };

    const onQuestionChange = (index: number, value: Question|null) => {
        const newQuestions = [...questions];

        if (value === null) {
            newQuestions.splice(index, 1);
        } else {
            newQuestions[index] = value;
        }
        setQuestions(newQuestions);
    }

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        quizService.postQuiz({
            title,
            passcode,
            maxUsers,
            questions,
        }).then(() => {
            setSaving(false);
            navigate("/quizzes");
        }).catch(() => {
            setSaving(false);
        });
    }

    if (saving) {
        return <p>Enregistrement en cours...</p>;
    }

    return (
        <form className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto" onSubmit={submit}>
            <h1>Créer un quiz</h1>
            <TextField
                label="Nom du quiz"
                variant="outlined"
                fullWidth
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex gap-16">
                <TextField
                    label="Mot de passe ?"
                    variant="outlined"
                    fullWidth
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                />
                <TextField
                    label="Max de participants ?"
                    variant="outlined"
                    fullWidth
                    type="number"
                    inputProps={{ min: 0 }}
                    value={maxUsers}
                    onChange={(e) => setMaxUsers(parseInt(e.target.value))}
                />
            </div>
            <Divider />
            {questions.map((question, index) => (
                <Fragment key={index}>
                    <CreateQuestion
                        questionObj={question}
                        questionLabel={`Question ${index + 1}`}
                        onChangeQuestion={question => onQuestionChange(index, question)}
                        onDeleteQuestion={() => onQuestionChange(index, null)}
                        isDeletable={index >= 1}
                    />
                    <Divider />
                </Fragment>
            ))}
            <Button variant="contained" onClick={addQuestion}>
                Ajouter une question
            </Button>

            <Button variant="contained" type="submit">
                Créer le quiz
            </Button>
        </form>
    );
}
