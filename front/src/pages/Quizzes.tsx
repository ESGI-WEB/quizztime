import { useEffect, useState } from "react";
import useQuizService from "../services/useQuizService.ts";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useNavigate} from "react-router-dom";

export default function Quizzes() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const quizService = useQuizService();
    const navigate = useNavigate();

    useEffect(() => {
        quizService.getAllQuizzes()
            .then(quizzes => {
                setQuizzes(quizzes);
            })
            .catch(error => {
                console.error("Error fetching quizzes:", error);
            });
    }, []);

    return (
        <div className="flex flex-column gap-16 flex-wrap align-center">
            <h1>Quizzes</h1>
            {quizzes.map((quiz) => (
                <div className="flex gap-16 flex-wrap flex-justify-center"  key={quiz.id}>
                    <Card className="flex gap-16 flex-justify-center" variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {quiz.title}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Gérer</Button>
                        </CardActions>
                    </Card>
                </div>

            ))}
            <div className="flex gap-16 flex-wrap flex-justify-center">
                <Button
                    size="small"
                    onClick={() => navigate("/create-quiz")}
                >Créer un Quiz</Button>
            </div>
        </div>
    );
}
