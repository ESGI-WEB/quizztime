import {FormEvent, useState} from "react";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hasError, setHasError] = useState(false);
    const [isAccountCreated, setIsAccountCreated] = useState(false);
    const navigate = useNavigate();


    const sumbit = (e: FormEvent) => {
        e.preventDefault();
        console.log(name, email, password);
    }

    return (
        <form className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto" onSubmit={sumbit}>
            <h1>Créer un compte</h1>
            <TextField
                label="Nom"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
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
                type="password"
            />
            <Button
                variant="contained"
                color="primary"
                type="submit"
            >Créer un compte</Button>

            {hasError && <p className="error">Formulaire invalide</p>}
            {isAccountCreated && <>
                <p>Compte créé avec succès</p>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/login")}
                >Se connecter</Button>
            </>}
            {!isAccountCreated &&
                <Button
                    variant="text"
                    color="primary"
                    onClick={() => navigate("/login")}
                >Se connecter</Button>
            }
        </form>
    )
}
