import {useNavigate} from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    return (
        <nav className='header'>
            <div className='actions'>
                <button onClick={() => navigate('/')}>Quizz d'aujourd'hui</button>
                <button onClick={() => navigate('/cards')}>Liste des cartes</button>
            </div>
            <div className="avatar">
                <span>JD</span>
            </div>
        </nav>
    )
}