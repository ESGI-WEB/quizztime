import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';


interface ChatComponentProps {
    roomId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ roomId }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const socketRef = useRef<SocketIOClient.Socket>();


    useEffect(() => {
        socketRef.current = io('http://localhost:8081');

        socketRef.current.on('server-chat-message', (message: string) => {
            console.log('Received message from server:', message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

    }, []);


    const handleMessageSend = () => {
        if (inputMessage.trim() !== '' && roomId) {
            socketRef.current.emit('chat-message', {
                message: inputMessage,
                roomId: roomId,
            });
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
