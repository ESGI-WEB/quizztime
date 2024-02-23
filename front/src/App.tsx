import './App.css'
import Header from "./components/Header";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Quizzes from "./pages/Quizzes.tsx";
import CreateQuiz from "./pages/CreateQuiz.tsx";

function App() {
  return (
    <BrowserRouter>
        <Header/>
        <div className="page-content">
            <Routes>
                <Route index element={<Home/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="register" element={<Register/>}/>
                <Route path="quizzes" element={<Quizzes/>}/>
                <Route path="create-quiz" element={<CreateQuiz/>}/>
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </div>
    </BrowserRouter>
  )
}

export default App
