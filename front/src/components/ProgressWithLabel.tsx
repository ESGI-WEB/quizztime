import Box from "@mui/material/Box";
import {LinearProgress} from "@mui/material";


export default function ProgressWithLabel(
    {
        timeLeft,
        timeToAnswer,
    }: {
        timeLeft: number,
        timeToAnswer: number,
    }
) {
    const normaliseTime = (value: number, maxTime: number) => ((value) * 100) / maxTime;

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Box sx={{width: '100%', mr: 1}}>
                    <LinearProgress
                        color={
                            timeLeft / 1000 <= 5 ? 'error' : timeLeft / 1000 <= 10 ? 'warning' : 'primary'
                        }
                        variant="determinate"
                        value={normaliseTime(timeLeft, timeToAnswer)}
                    />
                </Box>
                <Box sx={{minWidth: 35}}>
                    <p>{timeLeft / 1000} s</p>
                </Box>
            </Box>
        </Box>
    )
}