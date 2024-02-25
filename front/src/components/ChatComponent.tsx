import { useState, useEffect } from 'react';
import {socket} from "../socket";


function ChatComponent() {
    const [messages, setMessages] = useState<string[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');

    useEffect(() => {
        const handleChatMessage = (message: string) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        socket.on('server-chat-message', handleChatMessage);

        return () => {
            socket.off('server-chat-message', handleChatMessage);
        };
    }, []);

    const handleMessageSend = () => {
        if (inputMessage) {
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
}

export default ChatComponent;
