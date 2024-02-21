import {useNavigate} from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    return (
        <nav className='header'>
            <div className='actions'>
                <button onClick={() => navigate('/')}>Accueil</button>
            </div>
        </nav>
    )
}