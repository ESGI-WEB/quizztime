import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const ChatComponent: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const socketRef = useRef<SocketIOClient.Socket>();

    useEffect(() => {
        // Connexion au socket lors du montage du composant
        socketRef.current = io('http://localhost:8081');

        // Écoute des messages du serveur
        socketRef.current.on('server-chat-message', (message: string) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Nettoyage : Déconnexion du socket lors du démontage du composant
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const handleMessageSend = () => {
        if (inputMessage.trim() !== '') {
            console.log('Sending message:', inputMessage);
            socketRef.current.emit('chat-message', inputMessage);
            setInputMessage('');
        }
    };

    return (
        <div>
            <h1>Chat Room</h1>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
            />
            <button onClick={handleMessageSend}>Send</button>
        </div>
    );
};

export default ChatComponent;
