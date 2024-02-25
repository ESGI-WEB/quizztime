// ChatComponent.tsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8081');

const ChatComponent: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');

    useEffect(() => {
        // Écoute des messages du serveur
        socket.on('server-chat-message', (message: string) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
    }, []);

    const handleMessageSend = () => {
        if (inputMessage.trim() !== '') {
            console.log('Sending message:', inputMessage);
            socket.emit('chat-message', inputMessage);
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
