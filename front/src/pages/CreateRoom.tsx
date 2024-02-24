import Button from "@mui/material/Button";
import {socket} from "../socket";
import {useEffect, useState} from "react";
import {Room} from "../models/room.model";
import useQuizService from "../services/useQuizService";
import {MenuItem, Select} from "@mui/material";

export default function CreateRoom() {
    const [loading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [quiz, setQuiz] = useState<Quiz|null>(null);
    const [room, setRoom] = useState<Room|null>(null);
    const quizService = useQuizService();

    const queryUserQuizz = () => {
        quizService.getAllQuizzes().then((quizzes) => {
            setQuizzes(quizzes);
            setQuiz(quizzes[0]);
            setLoading(false);

            if (socket.connected) {
                socket.emit('has-rooms-joined', (room: Room) => {
                    if (room) {
                        setRoom(room);
                        setQuiz(quizzes.find((quizz) => quizz.id === room.quizId) ?? null);
                    }
                });
            }
        });
    };

    const createRoom = () => {
        if (!quiz) return;

        if (!socket.connected) {
            socket.connect();
        }
        socket.emit('create-room', {quizId: quiz.id});
    };

    const initOnCreatedRoom = () => {
        socket.on('room-created', (room) => {
            console.log('room-created', room);
            setRoom(room);
        });
    };

    const setQuizFromId = (id: number) => {
        const quiz = quizzes.find((quiz) => quiz.id === id);
        if (quiz) {
            setQuiz(quiz);
        }
    };

    useEffect(() => {
        queryUserQuizz();
        initOnCreatedRoom();
    }, []);

    if (loading) {
        return <div>Chargement en cours...</div>;
    }

    if (!loading && (!quiz || !quizzes)) {
        return <div>Vous n'avez aucun quizz pour le moment</div>;
    }

    if (room) {
        return (
            <div className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto">
                <h1>Salle créée</h1>
                <p>Code pour rejoindre la salle : {room.id}</p>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                >
                    Commencer le quizz
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto">
            <h1>Créer une salle de quizz</h1>
            <Select
                value={quiz?.id}
                onChange={(e) => setQuizFromId(e.target.value as number)}
            >
                {quizzes.map((quiz) => (
                    <MenuItem value={quiz.id} key={quiz.id}>
                        {quiz.title}
                    </MenuItem>
                ))}
            </Select>
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={createRoom}
            >
                Créer une salle
            </Button>
        </div>
    );
}
