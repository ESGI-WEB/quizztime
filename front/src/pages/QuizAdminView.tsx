import {Result} from "../models/result.model";
import Button from "@mui/material/Button";
import {socket} from "../socket";
import ProgressWithLabel from "../components/ProgressWithLabel";
import {useEffect, useRef, useState} from "react";
import QuizStats from "../components/QuizStats";
import {Question} from "../models/question.model";
import {Answer} from "../models/answer.model";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";

interface ParticipantsAnswers {
    name: string;
    answers?: Answer[];
}

export default function QuizAdminView() {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const timerInterval = useRef<any>();
    const [participants, setParticipants] = useState<ParticipantsAnswers[]>([]);
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [question, setQuestion] = useState<Question|null>(null);
    const [result, setResult] = useState<Result|null>(null);
    const navigate = useNavigate();
    const { room } = useParams();

    const onNewQuestion = (question: Question) => {
        setQuestion(question);
        setResult(null);
        setAllQuestions(allQuestions => {
            if (allQuestions.find((q) => q.id === question.id)) {
                return allQuestions;
            }
            return [...allQuestions, question];
        });
    }

    useEffect(() => {
        if (!socket.connected) {
            navigate('/create-room');
        }

        socket.emit('get-room', ({participants, currentQuestion}: {participants: string[], currentQuestion: Question}) => {
            const participantsWithAnswers = participants.map((participant) => ({name: participant, answers: []}));
            setParticipants([...participantsWithAnswers]);
            onNewQuestion(currentQuestion);
        });

        socket.on('participant-answered', (answer: Answer) => {
            setParticipants((participants) => {
                let newParticipantData = [...participants.map((participant) => {
                    if (participant.name === answer.userName) {
                        if (participant.answers?.find((a) => a.questionId === answer.questionId)) {
                            return {
                                ...participant,
                                answers: participant.answers?.map((a) => {
                                    if (a.questionId === answer.questionId) {
                                        return answer;
                                    }
                                    return a;
                                }),
                            };
                        } else {
                            return {
                                ...participant,
                                answers: [...(participant.answers ?? []), answer],
                            };
                        }
                    }
                    return participant;
                })];

                // order participants by most correct answers
                newParticipantData = newParticipantData.sort((a, b) => {
                    const aCorrectAnswers = a.answers?.filter((answer) => answer.choice?.isCorrect)?.length ?? 0;
                    const bCorrectAnswers = b.answers?.filter((answer) => answer.choice?.isCorrect)?.length ?? 0;
                    return bCorrectAnswers - aCorrectAnswers;
                });

                return newParticipantData;
            });
        });

        socket.on('question', (question: Question) => {
            onNewQuestion(question);
        });

        socket.on('question-result', (result: Result) => {
            setResult(result);
            timerInterval.current && clearInterval(timerInterval.current);
        });

        socket.on('quiz-ended', () => {
            timerInterval.current && clearInterval(timerInterval.current);
            navigate('/quiz/' + room + '/ended');
        });

        return () => {
            socket.off('participant-answered');
            socket.off('question');
            socket.off('question-result');
            socket.off('quiz-ended');
        }
    }, []);

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

    const nextQuestion = () => {
        socket.emit('launch-next-question');
    }

    return (
        <div className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto">
            <div className="flex gap-8 flex-justify-between flex-align-center">
                <h1>Pannel du quizz</h1>
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
            {participants.length > 0 &&
                <div>
                    <h2>Participants</h2>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 150 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nom</TableCell>
                                    <TableCell>Points</TableCell>
                                    {allQuestions.map((question) => (
                                        <TableCell key={question.id} align="right">{question.question}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {participants.map((participant) => (
                                    <TableRow
                                        key={participant.name}
                                    >
                                        <TableCell>
                                            {participant.name}
                                        </TableCell>
                                        <TableCell>
                                            {participant.answers?.filter((answer) => answer.choice?.isCorrect).length}
                                        </TableCell>
                                        {allQuestions.map((question) => {
                                            const answer = participant.answers?.find((answer) => answer.questionId === question.id);
                                            return (
                                                <TableCell key={question.id} align="right">
                                                    <Typography
                                                        color={answer?.choice?.isCorrect ? 'green' : (answer?.choice?.choice ? 'error' : 'secondary')}
                                                        component="span"
                                                    >
                                                        {answer?.choice?.choice ?? 'Non répondu'}
                                                    </Typography>
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            }
        </div>
    );
}