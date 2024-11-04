import React, { useState } from 'react';
import { Message } from '../../backendSrc/interface/message';
import './Home.css';

interface ChatProps {
    selected: string | null;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const sendMessage = async (
    senderName: string, 
    recipientName: string, 
    content: string, 
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setError: React.Dispatch<React.SetStateAction<string | null>> // Lägg till setError här
) => {
    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, senderName, recipientName }),
        });

        if (!response.ok) throw new Error('Kunde inte skicka meddelande');
        const updatedMessages = await response.json(); // Hämta uppdaterade meddelanden
        setMessages(updatedMessages); // Uppdatera meddelandelistan i state
        setError(null); // Återställ felmeddelandet om meddelandet skickas framgångsrikt
    } catch (error) {
        console.error('Fel vid skickande av meddelande:', error);
        setError(error instanceof Error ? error.message : 'Ett oväntat fel inträffade'); // Sätt felmeddelande
    }
}

const GuestChat: React.FC<ChatProps> = ({ selected, messages, setMessages }) => {
    const [messageContent, setMessageContent] = useState('');
    const [error, setError] = useState<string | null>(null); // State för felmeddelanden

    const handleSendMessage = () => {
        // Kolla om det är en användare eller en kanal
        const senderName = localStorage.getItem('username'); 
        const recipientName = selected; // Kanal eller användare
        if (recipientName) {
            sendMessage(senderName || '', recipientName, messageContent, setMessages, setError); // Skicka setError som argument
        } else {
            console.error('Recipient name is null');
        }
        
        // Rensa meddelandet efter att det skickats
        setMessageContent('');
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
                 {/* Visa felmeddelande om det finns */}
                {error && <div className="error-message">{error}</div>}
            </section>
      </>
    );
};

export default GuestChat;
