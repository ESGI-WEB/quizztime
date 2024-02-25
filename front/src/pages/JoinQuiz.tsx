import Button from "@mui/material/Button";
import {socket} from "../socket";
import {FormEvent, useEffect, useState} from "react";
import {Room} from "../models/room.model";
import {TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function JoinQuiz() {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [passcode, setPasscode] = useState('');
    const [showPasscodeField, setShowPasscodeField] = useState(false);
    const navigate = useNavigate();

    const togglePasscodeField = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        setShowPasscodeField(e.target.checked);
    }

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

        socket.emit('join-room', {roomId: code, name, passcode});
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
            <FormControlLabel
                control={
                    <Checkbox
                        checked={showPasscodeField}
                        onChange={togglePasscodeField}
                        color="primary"
                    />
                }
                label="Mot de passe ?"
            />
            {showPasscodeField && (
                <TextField
                    label="Mot de passe"
                    variant="outlined"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                />
            )}
            <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                onClick={joinRoom}
                aria-live="polite"
                aria-label="Rejoindre la salle"
            >
                Rejoindre la salle
            </Button>
        </form>
    );
}
