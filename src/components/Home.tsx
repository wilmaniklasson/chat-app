import './Home.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Channel } from '../../backendSrc/interface/channel';
import { Message } from '../../backendSrc/interface/message';


// Home-komponenten
const Home: React.FC = () => {
    // Navigate-funktion från react-router-dom
    const navigate = useNavigate();
    // States för användare, kanaler och meddelanden
    const [users, setUsers] = useState<{ _id: string; username: string; password: string }[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [messages, setMessages] = useState<Message[]>([]); 

    // Logga ut användaren
    const handleLogUt = () => {
        //console.log('Loggar ut');
        // Ta bort token från localStorage
        localStorage.removeItem('token');
        // Navigera till startsidan
        navigate('/');
    };

    // Hämta användare, kanaler och meddelanden med useEffect
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Hämta användare
                const userResponse = await fetch('/api/users');
                if (!userResponse.ok) throw new Error('Kunde inte hämta användare');
                const usersData = await userResponse.json();
                setUsers(usersData);

                // Hämta kanaler
                const channelResponse = await fetch('/api/channels');
                if (!channelResponse.ok) throw new Error('Kunde inte hämta kanaler');
                const channelsData = await channelResponse.json();
                setChannels(channelsData);
           
                // Hämta token från localStorage
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Ingen token hittades');
                    return;
                }

                // Hämta skyddade meddelanden
                const messagesResponse = await fetch('/api/users/protected', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Om meddelanden inte kunde hämtas
                if (!messagesResponse.ok) throw new Error('Kunde inte hämta meddelanden');
                const messagesData = await messagesResponse.json();
                setMessages(messagesData.messages); 
            } catch (error) {
                console.error('Fel vid hämtning av data:', error);
                
            }
        };

        // Kör fetchData
        fetchData();
    }, []); // tom array för att useEffect ska köras en gång

    return (
        <>
            {/* Header */} 
            <header className="header-container">
                <h1 className="header-title">Chappy</h1>
                <div className="user-status-container">
                    <span className="user-status-text">Inloggad som Alice</span>
                    <button onClick={handleLogUt} className="logut-button">Logga ut</button>
                </div>
            </header>

            {/* Main */}
            <main className='home-main'>
                <nav className="nav-container">
                    {/* Lista med [Kanaler] */}
                    <ul className="nav-list">
                        <li className="nav-item">[Kanaler]</li>
                        {channels.map(channel => (
                            <li key={channel._id.toString()} className="nav-item">
                                <a className="nav-link" href={`${channel.name}`}>{`${channel.name}`}</a>
                            </li>
                        ))}

                        {/* Input för att skapa ny kanal */}
                        <li className="nav-item">
                            <input title="Skapa ny kanal" placeholder="Skapa ny kanal" />
                            <button>Lägg till</button>
                        </li>
                        <li className="nav-item"><hr /></li>
                        {/* Lista med användarnamn för att kunna skicka [DM]*/}
                        <li className="nav-item" title="Direktmeddelanden">[DM]</li>
                        {users.map(user => (
                            <li key={user._id} className="nav-item">
                                <a className="nav-link" href="#">{user.username}</a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Chat-container */}
                <div className="chat-container">
                    <section className="chat-header">
                         <span className="chat-name"></span>
                    </section>

                    {/* Sektion för chatthistorik */}
                    <section className="chat-history">
                        {messages.map(message => (
                            <section key={message._id.toString()} className="chat-message">
                                <p>{message.senderName}:</p>
                                <p className='text'>{message.content}</p>
                                <p className='time'>{new Date(message.timestamp).toLocaleTimeString()}</p> 
                            </section>
                        ))}
                    </section>

                    {/* Input och knapp för att skicka meddelande */}
                    <section>
                        <input type="text" className="chat-input" placeholder="Ditt meddelande..." />
                        <button className="send-button">Skicka</button>
                    </section>
                </div>
            </main>
        </>
    );
};

export default Home;