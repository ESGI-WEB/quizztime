import QuizStats from "../components/QuizStats";
import {useEffect, useRef, useState} from "react";
import {socket} from "../socket";
import Button from "@mui/material/Button";
import {Chip, CircularProgress} from "@mui/material";
import {Room} from "../models/room.model";
import {useNavigate, useParams} from "react-router-dom";
import {Result} from "../models/result.model";
import Typography from "@mui/material/Typography";
import ProgressWithLabel from "../components/ProgressWithLabel";
import ChatComponent from "../components/ChatComponent.tsx";

export default function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState<Question|undefined>(undefined);
    const [selectedChoice, setSelectedChoice] = useState<number|undefined>(undefined);
    const [result, setResult] = useState<Result|undefined>(undefined);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const timerInterval = useRef<any>();
    const navigate = useNavigate();
    const { room } = useParams();

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
            socket.emit('has-rooms-joined', (room: Room) => {
                if (!room) {
                    navigate('/join-room');
                }
            });
        }

        socket.on('question', (question: Question) => {
            setCurrentQuestion(question)
            setSelectedChoice(undefined)
            setResult(undefined)
        });

        socket.on('question-result', (result: Result) => {
            timerInterval.current && clearInterval(timerInterval.current);
            setCurrentQuestion(undefined);
            setResult(result);
        });

        socket.on('quiz-ended', () => {
            navigate('/quiz/' + room + '/ended');
        });

        return () => {
            socket.off('question');
            socket.off('quiz-ended');
        }
    }, []);

    useEffect(() => {
        timerInterval.current && clearInterval(timerInterval.current);
        if (!currentQuestion) return;

        let timingLeft = currentQuestion.timeToAnswer ?? 0;
        setTimeLeft(timingLeft);

        timerInterval.current = setInterval(() => {
            timingLeft = timingLeft - 1000;
            setTimeLeft(timingLeft);
            if (timingLeft <= 0) {
                clearInterval(timerInterval.current);
                setCurrentQuestion(undefined);
            }
        }, 1000);
    }, [currentQuestion]);

    useEffect(() => {
        if (selectedChoice) {
            socket.emit('answer', {choiceId: selectedChoice});
        }
    }, [selectedChoice]);

    return (
        <div className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto">
            <div className="flex gap-8 flex-justify-between flex-align-center">
                <h1>Quizz</h1>
                <QuizStats/>
            </div>
            {!currentQuestion &&
                <div className="flex gap-16 flex-align-center">
                    <p>Veuillez attendre la prochaine question</p>
                    <CircularProgress
                        color="primary"
                        size={20}
                    />
                </div>
            }
            {currentQuestion && (
                <div>
                    {currentQuestion.timeToAnswer &&
                        <ProgressWithLabel timeLeft={timeLeft} timeToAnswer={currentQuestion.timeToAnswer}/>
                    }

                    <h2>{currentQuestion.question}</h2>
                    <div className="flex gap-16 flex-wrap">
                        {currentQuestion.choices?.map((choice) => (
                            <Button
                                key={choice.id}
                                variant="contained"
                                color={selectedChoice === choice.id ? 'success' : 'primary'}
                                onClick={() => setSelectedChoice(choice.id)}
                            >{choice.choice}</Button>
                        ))}
                    </div>
                </div>
            )}

            {result && <>
                {result.choiceId === selectedChoice ? <h2>Bravo !</h2> : <h2>Dommage :(</h2>}
                <div className="flex gap-16 flex-align-center">
                    <Chip
                        label={result.numberOfRightAnswers}
                        color="secondary"
                        variant="outlined"
                    />
                    <span>participants ont répondu correctement</span>
                </div>
                <p>La bonne réponse était <Typography
                        component="span"
                        color={result.choiceId === selectedChoice ? 'success' : 'error'}
                    >{result.choice}</Typography>
                </p>
            </>}
            <ChatComponent/>
        </div>
    )
}