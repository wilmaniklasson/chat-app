import React, { useState } from 'react';
import { Message } from '../../backendSrc/interface/message';
import './Home.css';
import { useStore} from '../useStore'

interface ChatProps {
    selected: string | null;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const sendMessage = async (
    senderName: string, 
    recipientName: string, 
    content: string, 
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, senderName, recipientName}),
        });

        if (!response.ok) throw new Error('Kunde inte skicka meddelande');
     
        const newMessage = await response.json(); // Få det nya meddelandet
        setMessages((prevMessages) => [...prevMessages, newMessage]); // Lägg till det nya meddelandet i listan
    } catch (error) {
        console.error('Fel vid skickande av meddelande:', error);
    }
};

const Chat: React.FC<ChatProps> = ({ selected, messages, setMessages }) => {
    const [messageContent, setMessageContent] = useState('');
    const [error, setError] = useState(''); // State för felmeddelande
    const { username } = useStore(); // Hämta användarnamnet från Zustand-storen

    const handleSendMessage = () => {
        const senderName = username;
        const recipientName = selected; // Kanal eller användare

        if (!messageContent.trim()) { // Kolla om meddelandet är tomt
            setError('Meddelandet får inte vara tomt.'); // Sätt felmeddelande
            return; // Avbryt funktionen
        }

        if (recipientName) {
            sendMessage(senderName || '', recipientName, messageContent, setMessages);
            setError(''); // Rensa felmeddelandet om meddelandet skickas framgångsrikt
        } else {
            console.error('Recipient name is null');
        }
        
        setMessageContent(''); // Rensa meddelandet efter att det skickats
    };

    return (
        <>
            <section className="chat-header">
                <span className="chat-name">{selected}</span>
            </section>

            <section className="chat-history">
                {messages.length === 0 ? (
                    <p className="no-messages">Inga meddelanden ännu.</p>
                ) : (
                    messages.map(message => (
                        <section key={message._id ? message._id.toString() : 'default-key'} className="chat-message">
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
                {error && <div className="error-message">{error}</div>}  {/* Visar felmeddelandet */}
            </section>
        </>
    );
};

export default Chat;
