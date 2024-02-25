import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';
import { socket } from '../socket';

interface Message {
    name: string;
    message: string;
}

function ChatComponent() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');

    const handleMessageSend = () => {
        if (inputMessage) {
            socket.emit('chat-message', inputMessage);
            setInputMessage('');
        }
    };

    useEffect(() => {
        const handleChatMessage = (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        socket.on('server-chat-message', handleChatMessage);

        return () => {
            socket.off('server-chat-message', handleChatMessage);
        };
    }, []);

    return (
        <Paper elevation={3} style={{ maxWidth: 400, marginTop: 24, padding: 20 }}>
            <Typography variant="h5" gutterBottom>
                Chat Room
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {messages.map((message, index) => (
                    <div key={index} style={{ marginBottom: 10 }}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>{message.name}</Typography>
                        <Typography variant="body1">{message.message}</Typography>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                <TextField
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    label="Message"
                    variant="outlined"
                    fullWidth
                />
                <Button variant="contained" color="primary" onClick={handleMessageSend} style={{ marginLeft: 10 }}  aria-label="Envoyer le message">
                    Envoyer
                </Button>
            </div>
        </Paper>
    );
}

export default ChatComponent;
