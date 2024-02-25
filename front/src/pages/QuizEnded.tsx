import {useEffect, useState} from "react";
import {socket} from "../socket";
import {Answer} from "../models/answer.model";
import {useNavigate} from "react-router-dom";
import ResultsTable, {ParticipantsAnswers} from "../components/ResultsTable";
import {Question} from "../models/question.model";

export default function QuizEnded() {

    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [participants, setParticipants] = useState<ParticipantsAnswers[]>([]);

    const [results, setResults] = useState<Answer[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket.connected) {
            navigate('/join-room');
        }

        socket.on('quiz-end-results', (answers) => {
            setResults(answers);
        })
    }, []);

    useEffect(() => {
        // set all questions
        const questions = results.map((result) => result.question)
            .filter((question, index, self) =>
                    index === self.findIndex((t) => (
                        t && question && t.id === question.id
                    ))
            );

        setAllQuestions(questions as Question[]);

        const participants: ParticipantsAnswers[] = [];
        // set participants
        for (const result of results) {
            const participant = participants.find((p) => p.name === result.userName);
            if (participant) {
                participant.answers?.push(result);
            } else {
                participants.push({
                    name: result.userName,
                    answers: [result]
                });
            }
        }

        // sort participants by score
        participants.sort((a, b) => {
            const scoreA = a.answers?.filter((answer) => answer.choice?.isCorrect).length ?? 0;
            const scoreB = b.answers?.filter((answer) => answer.choice?.isCorrect).length ?? 0;
            return scoreB - scoreA;
        });

        setParticipants(participants);
    }, [results]);

    return (
        <div className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto">
            <h1>Le quizz est terminé !</h1>
            {results && <ResultsTable allQuestions={allQuestions} participants={participants}/>}
        </div>
    );
}