import './App.css'
import Header from "./components/Header";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Quizzes from "./pages/Quizzes.tsx";
import CreateQuiz from "./pages/CreateQuiz.tsx";
import {useEffect, useState} from "react";
import {socket} from "./socket";
import CreateRoom from "./pages/CreateRoom";
import JoinQuiz from "./pages/JoinQuiz";
import {Alert, Snackbar} from "@mui/material";
import Quiz from "./pages/Quiz";
import QuizEnded from "./pages/QuizEnded";

function App() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [snackBarData, setSnackBarData] = useState<{message: string, level: string}|null>(null);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('error', (error) => {
            setSnackBarData({level: 'error', message: error});
        });
        socket.on('quiz-started', () => {
            setSnackBarData({level: 'success', message: 'Le quizz a commencé !'});
        });

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('error');
            socket.off('quiz-started');
        };
    }, []);

    return (
        <BrowserRouter>
            <Header isConnected={isConnected}/>
            <div className="page-content">
                <Routes>
                    <Route index element={<Home/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route path="create-room" element={<CreateRoom/>}/>
                    <Route path="quizzes" element={<Quizzes/>}/>
                    <Route path="create-quiz" element={<CreateQuiz/>}/>
                    <Route path="join-room" element={<JoinQuiz/>}/>
                    <Route path="quiz/:room" element={<Quiz/>}/>
                    <Route path="quiz/:room/ended" element={<QuizEnded/>}/>
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
            </div>
            <Snackbar
                open={snackBarData !== null}
                autoHideDuration={6000}
                onClose={() => setSnackBarData(null)}
            >
                <Alert
                    onClose={() => setSnackBarData(null)}
                    severity={snackBarData?.level as any}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackBarData?.message}
                </Alert>
            </Snackbar>
        </BrowserRouter>
    );
}

export default App
