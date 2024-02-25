import {Chip} from "@mui/material";
import {useEffect, useState} from "react";
import {socket} from "../socket";

export default function QuizStats(

) {
    const [numberOnline, setNumberOnline] = useState(1);

    useEffect(() => {
        socket.emit('get-room', (data: {size: number}) => {
            if (!data) return;
            setNumberOnline(data.size);
        });

        socket.on('room-updated', (data) => {
            if (!data) return;
            setNumberOnline(data.size);
        });

        return () => {
            socket.off('room-updated');
        }
    });

    return (
        <div className="flex flex-justify-between">
            <Chip
                label={(numberOnline - 1) + ' participant.s en ligne'}
                color="primary"
                variant="outlined"
            />
        </div>
    );
}