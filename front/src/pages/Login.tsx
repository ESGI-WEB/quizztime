import {FormEvent, useState} from "react";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hasError, setHasError] = useState(false);
    const navigate = useNavigate();

    const sumbit = (e: FormEvent) => {
        e.preventDefault();
        console.log(email, password);
    }

    return (
        <form className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto" onSubmit={sumbit}>
            <h1>Connexion</h1>
            <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Mot de passe"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button
                variant="contained"
                color="primary"
                type="submit"
            >Se connecter</Button>

            <Button
                variant="text"
                color="primary"
                onClick={() => navigate("/register")}
            >Créer un compte</Button>
        </form>
    )
}
