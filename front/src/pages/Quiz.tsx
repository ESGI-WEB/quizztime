import QuizStats from "../components/QuizStats";
import {useEffect, useRef, useState} from "react";
import {socket} from "../socket";
import Button from "@mui/material/Button";
import {LinearProgress} from "@mui/material";
import {Room} from "../models/room.model";
import {useNavigate, useParams} from "react-router-dom";
import Box from "@mui/material/Box";

export default function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState<Question|undefined>(undefined);
    const [selectedChoice, setSelectedChoice] = useState<number|undefined>(undefined);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const timerInterval = useRef<any>();
    const navigate = useNavigate();
    const { room } = useParams();

    const normaliseTime = (value: number, maxTime: number) => ((value) * 100) / maxTime;

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
        });

        socket.on('quiz-ended', () => {
            navigate('/quiz/' + room + '/ended');
        });

        return () => {
            socket.off('question');
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
            <h1>Quizz</h1>
            <QuizStats/>
            {!currentQuestion && <p>Veuillez attendre le début du quizz...</p>}
            {currentQuestion && (
                <div>
                    {currentQuestion.timeToAnswer &&
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                    <LinearProgress
                                        color={
                                            timeLeft / 1000 <= 5 ? 'error' : timeLeft / 1000 <= 10 ? 'warning' : 'primary'
                                        }
                                        variant="determinate"
                                        value={normaliseTime(timeLeft, currentQuestion.timeToAnswer)}
                                    />
                                </Box>
                                <Box sx={{ minWidth: 35 }}>
                                    <p>{timeLeft / 1000} s</p>
                                </Box>
                            </Box>
                        </Box>
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

        </div>
    )
}