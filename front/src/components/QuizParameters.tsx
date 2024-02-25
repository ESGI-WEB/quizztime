import {useEffect, useState} from "react";
import {TextField} from "@mui/material";
import {socket} from "../socket.ts";
import IconButton from "@mui/material/IconButton";
import {CheckCircleOutlined} from "@mui/icons-material";

export default function QuizParameters() {
    const DEFAULT_TIME = 20;
    const [timeToAnswer, setTimeToAnswer] = useState(DEFAULT_TIME);

    const handleTimeChange = () => {
        let timeToAnswerToSend = timeToAnswer;
        if (timeToAnswerToSend < 5) {
            setTimeToAnswer(5);
            timeToAnswerToSend = 5;
        }
        socket.emit('update-time', {timeToAnswer: timeToAnswerToSend * 1000});
    };

    useEffect(() => {
        socket.on('update-time', ({timeToAnswer}) => {
            setTimeToAnswer(timeToAnswer / 1000);
        });

        return () => {
            socket.off('update-time');
        };
    }, []);

    return (
        <div className="flex gap-16">
            <TextField
                label="Temps pour répondre à chaque question en secondes"
                type="number"
                value={timeToAnswer}
                onChange={(event) => setTimeToAnswer(parseInt(event.target.value))}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{ min: 5 }}
                variant="standard"
            />
            <IconButton
                onClick={handleTimeChange}
            >
                <CheckCircleOutlined/>
            </IconButton>
        </div>
    );
}