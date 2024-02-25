import {Result} from "../models/result.model";
import Button from "@mui/material/Button";
import {socket} from "../socket";
import ProgressWithLabel from "./ProgressWithLabel";
import {useEffect, useRef, useState} from "react";
import QuizStats from "./QuizStats";
import QuizParameters from "./QuizParameters.tsx";

export default function QuizAdminView(
    {
        question,
        result,
        hasEnded,
    }: {
        question: Question | null,
        result: Result | null,
        hasEnded: boolean,
    }
) {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const timerInterval = useRef<any>();

    useEffect(() => {
        timerInterval.current && clearInterval(timerInterval.current);
        if (!question) return;

        let timingLeft = question.timeToAnswer ?? 0;
        setTimeLeft(timingLeft);

        timerInterval.current = setInterval(() => {
            timingLeft = timingLeft - 1000;
            setTimeLeft(timingLeft);
            if (timingLeft <= 0) {
                clearInterval(timerInterval.current);
            }
        }, 1000);
    }, [question]);

    useEffect(() => {
        if (hasEnded || result) {
            clearInterval(timerInterval.current);
        }
    }, [hasEnded, result]);

    const nextQuestion = () => {
        socket.emit('launch-next-question');
    }

    if (hasEnded) {
        return (
            <div className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto">
                <h1>Le quizz est terminé</h1>
            </div>
        )
    }

    return (
        <div className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto">
            <QuizParameters/>
            <div className="flex gap-8 flex-justify-between flex-align-center">
                <h1>Panel du quizz</h1>
                <QuizStats/>
            </div>
            {question && !result &&
                <div>
                    {question.timeToAnswer &&
                        <ProgressWithLabel timeLeft={timeLeft} timeToAnswer={question.timeToAnswer}/>
                    }
                    <p>Question en cours : {question.question}</p>
                </div>
            }
            {result &&
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={nextQuestion}
                    >
                        Démarrer la question suivante
                    </Button>
                </div>
            }
        </div>
    );
}