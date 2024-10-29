import './Home.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Channel } from '../../backendSrc/interface/channel';
import { Message } from '../../backendSrc/interface/message';
import { FaLock } from 'react-icons/fa';

// Home-komponenten
const Home: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<{ _id: string; username: string; password: string }[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [username, setUsername] = useState<string | null>(null);

    const handleLogUt = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch('/api/users');
                if (!userResponse.ok) throw new Error('Kunde inte hämta användare');
                const usersData = await userResponse.json();
                setUsers(usersData);

                const channelResponse = await fetch('/api/channels');
                if (!channelResponse.ok) throw new Error('Kunde inte hämta kanaler');
                const channelsData = await channelResponse.json();
                setChannels(channelsData);

                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Ingen token hittades');
                    return;
                }

                const storedUsername = localStorage.getItem('username');
                setUsername(storedUsername); // Sätt användarnamnet direkt här

                const messagesResponse = await fetch('/api/users/protected', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!messagesResponse.ok) throw new Error('Kunde inte hämta meddelanden');
                const messagesData = await messagesResponse.json();
                setMessages(messagesData.messages); 
            } catch (error) {
                console.error('Fel vid hämtning av data:', error);
            }
        };

        fetchData();
    }, []); // tom array för att useEffect ska köras en gång

    return (
        <>
            <header className="header-container">
                <h1 className="header-title">Chappy</h1>
                <div className="user-status-container">
                    {username && <span className="user-status-text">Inloggad som: {username}</span>}
                    <button onClick={handleLogUt} className="logut-button">Logga ut</button>
                </div>
            </header>

            <main className='home-main'>
                <nav className="nav-container">
                    <ul className="nav-list">
                        <li className="nav-item">[Kanaler]</li>
                        {channels.map(channel => (
                            <li key={channel.name} className="nav-item">
                                <a className="nav-link" href={`${channel.name}`}>
                                    {channel.name}
                                    {channel.isPrivate && <FaLock className="private-icon" />} 
                                </a>
                            </li>
                        ))}
                        <li className="nav-item">
                            <input title="Skapa ny kanal" placeholder="Skapa ny kanal" />
                            <button>Lägg till</button>
                        </li>
                        <li className="nav-item"><hr /></li>
                        <li className="nav-item" title="Direktmeddelanden">[DM]</li>
                        {users.map(user => (
                            <li key={user._id} className="nav-item">
                                <a className="nav-link" href="#">{user.username}</a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="chat-container">
                    <section className="chat-header">
                         <span className="chat-name"></span>
                    </section>

                    <section className="chat-history">
                        {messages.map(message => (
                            <section key={message._id.toString()} className="chat-message">
                                <p>{message.senderName}:</p>
                                <p className='text'>{message.content}</p>
                                <p className='time'>{new Date(message.timestamp).toLocaleTimeString()}</p> 
                            </section>
                        ))}
                    </section>

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
