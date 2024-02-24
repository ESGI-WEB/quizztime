import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate} from "react-router-dom";
import useUserService from "../services/useUserService";
import {PersonOff} from "@mui/icons-material";

export default function Header(
    {
        isConnected
    }: {
        isConnected: boolean
    }
) {
    const navigate = useNavigate();
    const userService = useUserService();

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        QuizzTime
                        {isConnected ?
                            <small aria-label="connected"> 🟢</small> :
                            <small aria-label="disconnected"> 🔴</small>
                        }
                    </Typography>
                    {!userService.currentUser() && <Button
                        color="inherit"
                        onClick={() => navigate("/login")}
                    >Connexion</Button>}
                    {userService.currentUser() && <>
                        <Button
                            color="inherit"
                            onClick={() => navigate("/create-room")}
                        >Créer une salle</Button>
                        <Button
                            color="inherit"
                            onClick={() => navigate("/quizzes")}
                        >Mes Quizz</Button>
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                userService.logout();
                                navigate("/");
                            }}
                        >
                            <PersonOff/>
                        </IconButton>
                    </>}
                </Toolbar>
            </AppBar>
        </Box>
    );
}