import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Question} from "../models/question.model";
import {Answer} from "../models/answer.model";

export interface ParticipantsAnswers {
    name: string;
    answers?: Answer[];
}

export default function ResultsTable(
    {
        allQuestions,
        participants,
    }: {
        allQuestions: Question[],
        participants: ParticipantsAnswers[],
    }
) {
    return (
        <TableContainer component={Paper} aria-label="Résultats du questionnaire">
            <Table sx={{minWidth: 150}}>
                <TableHead>
                    <TableRow>
                        <TableCell component="th" scope="col">Nom</TableCell>
                        <TableCell component="th" scope="col">Points</TableCell>
                        {allQuestions.map((question) => (
                            <TableCell key={question.id} align="right" component="th" scope="col">
                                {question.question}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {participants.map((participant) => (
                        <TableRow key={participant.name}>
                            <TableCell>{participant.name}</TableCell>
                            <TableCell>{participant.answers?.filter((answer) => answer.choice?.isCorrect).length}</TableCell>
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
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}