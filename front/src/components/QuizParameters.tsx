import {useEffect, useState} from "react";
import {TextField} from "@mui/material";
import {socket} from "../socket.ts";

export default function QuizParameters() {
    const [timeToAnswer, setTimeToAnswer] = useState(20*1000);

    const handleTimeChange = (event) => {
        const newValue = parseInt(event.target.value) || 20*1000;
        setTimeToAnswer(newValue);
        socket.emit('update-time', { timeToAnswer: newValue });
    };

    useEffect(() => {
        socket.on('update-time', ({ timeToAnswer }) => {
            setTimeToAnswer(timeToAnswer);
        });

        return () => {
            socket.off('update-time');
        };
    }, []);

    return (
        <TextField
            label="Temps pour répondre à chaque question en milisecondes"
            type="number"
            value={timeToAnswer}
            onChange={handleTimeChange}
            InputLabelProps={{
                shrink: true,
            }}
            variant="standard"
        />
    );
}