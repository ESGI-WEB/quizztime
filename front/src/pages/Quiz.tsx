import Button from "@mui/material/Button";
import {socket} from "../socket";
import {FormEvent, useEffect, useState} from "react";
import {Room} from "../models/room.model";
import {TextField} from "@mui/material";

export default function Quiz() {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [room, setRoom] = useState<Room | null>(null);

    const hasJoinedRoom = () => {
        if (socket.connected) {
            socket.emit('has-rooms-joined', (room: Room) => {
                if (room) {
                    setRoom(room);
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
            setRoom(room);
        });
    }, []);

    if (room) {
        return (
            <div className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto">
                <p>Veuillez attendre le début du quizz</p>
            </div>
        )
    }

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
