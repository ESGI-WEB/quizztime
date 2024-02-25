import {FormEvent, useState} from "react";
import {InputAdornment, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import useUserService from "../services/useUserService";
import {tokenKey} from "../models/jwt.model";
import {User} from "../models/user.model";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [hasError, setHasError] = useState(false);
    const navigate = useNavigate();
    const userService = useUserService();

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password || password !== confirmPassword) {
            setHasError(true);
            return;
        }
        setHasError(false);
        userService.post({name, email, password}).then((user: User) => {
            if (user.token) {
                localStorage.setItem(tokenKey, user.token);
                navigate("/");
            }
        }).catch((e) => {
            console.error(e);
            setHasError(true);
        });
    };

    return (
        <form className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto" onSubmit={handleSubmit}>
            <h1>Créer un compte</h1>
            <TextField
                label="Nom"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <TextField
                label="Mot de passe"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={toggleShowPassword}>
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                required
            />
            <TextField
                label="Confirmer le mot de passe"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? 'text' : 'password'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={toggleShowConfirmPassword}>
                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                required
            />
            {hasError && <p className="error">Formulaire invalide</p>}
            <Button
                variant="contained"
                color="primary"
                type="submit"
                aria-label="Créer un compte"
            >
                Créer un compte
            </Button>

            <Button
                variant="text"
                color="primary"
                onClick={() => navigate("/login")}
                aria-label="Se connecter"
            >
                Se connecter
            </Button>
        </form>
    );
}