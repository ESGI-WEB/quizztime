import Button from "@mui/material/Button";
import {socket} from "../socket";
import {FormEvent, useEffect, useState} from "react";
import {Room} from "../models/room.model";
import {TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";

export default function JoinQuiz() {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const hasJoinedRoom = () => {
        if (socket.connected) {
            socket.emit('has-rooms-joined', (room: Room) => {
                if (room) {
                    navigate('/quiz/' + room.id);
                }
            })
        }
    }

    const joinRoom = (e: FormEvent) => {
        e.preventDefault();

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit('join-room', {roomId: code, name});
    }

    useEffect(() => {
        hasJoinedRoom();
        socket.on('room-joined', (room: Room) => {
            navigate('/quiz/' + room.id);
        });

        return () => {
            socket.off('room-joined');
        }
    }, []);

    return (
        <form className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto" onSubmit={joinRoom}>
            <h1>Rejoindre une salle de quizz</h1>
            <TextField
                label="Nom"
                variant="outlined"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                label="Code de la salle"
                variant="outlined"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                onClick={joinRoom}
            >
                Rejoindre la salle
            </Button>

        </form>
    )
}
