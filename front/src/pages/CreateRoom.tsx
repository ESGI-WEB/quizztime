import Button from "@mui/material/Button";
import {socket} from "../socket";
import {useEffect, useState} from "react";
import {Room} from "../models/room.model";

export default function CreateRoom() {
    const [quizz, setQuizz] = useState<any>(null); // TODO
    const [room, setRoom] = useState<Room|null>(null); // TODO

    const queryUserQuizz = () => {
        // TODO
        setQuizz({
            id: 1,
        });
    };

    const createRoom = () => {
        if (!socket.connected) {
            socket.connect();
            socket.once('connect', () => {
                // TODO add token
                socket.emit('create-room', {quizId: quizz.id});
            });
        } else {
            socket.emit('create-room', {quizId: quizz.id});
        }
    };

    const initOnCreatedRoom = () => {
        socket.on('room-created', (room) => {
            console.log('room-created', room);
            setRoom(room);
        });
    }

    useEffect(() => {
        queryUserQuizz();
        initOnCreatedRoom();
    }, []);

    if (room) {
        return (
            <div className="flex flex-column gap-16 flex-wrap align-center">
                <h1>Salle créé</h1>
                <p>Code pour rejoindre la salle : {room.id}</p>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                >
                    Commencer le quizz
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto">
            <h1>Créer une salle de quizz</h1>
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={createRoom}
            >
                Créer une salle
            </Button>

        </div>
    )
}
