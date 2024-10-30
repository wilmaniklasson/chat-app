import React, { useState } from 'react';
import { Message } from '../../backendSrc/interface/message';
import './Home.css';

interface ChatProps {
    selected: string | null;
    messages: Message[];
}

const sendMessage = async (senderName: string, recipientName: string, content: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Ingen token hittades');

        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content, senderName, recipientName}),
        });

        if (!response.ok) throw new Error('Kunde inte skicka meddelande');
    } catch (error) {
        console.error('Fel vid skickande av meddelande:', error);
    }
}

const Chat: React.FC<ChatProps> = ({ selected, messages }) => {
    const [messageContent, setMessageContent] = useState('');

    const handleSendMessage = () => {
        // Kolla om det är en användare eller en kanal
        const senderName = localStorage.getItem('username'); 
        const recipientName = selected; // Kanal eller användare
        if (recipientName) {
            sendMessage(senderName || '', recipientName, messageContent);
        } else {
            console.error('Recipient name is null');
        }
        
        // Rensa meddelandet efter att det skickats
        setMessageContent('');
    };

    return (
        <div className="chat-container">
            <section className="chat-header">
                <span className="chat-name">{selected}</span>
            </section>

            <section className="chat-history">
                {messages.length === 0 ? (
                    <p className="no-messages">Inga meddelanden ännu.</p>
                ) : (
                    messages.map(message => (
                        <section key={message._id.toString()} className="chat-message">
                            <p>{message.senderName}:</p>
                            <p className='text'>{message.content}</p>
                            <p className='time'>{new Date(message.timestamp).toLocaleTimeString()}</p>
                        </section>
                    ))
                )}
            </section>

            <section>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Ditt meddelande..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)} // Hantera ändring av meddelandet
                />
                <button className="send-button" onClick={handleSendMessage}>Skicka</button>
            </section>
        </div>
    );
};

export default Chat;
