import './App.css'
import Header from "./components/Header";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
        <Header/>
        <div className="page-content">
            <Routes>
                <Route index element={<Home/>}/>
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </div>
    </BrowserRouter>
  )
}

export default App
