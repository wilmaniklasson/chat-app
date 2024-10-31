import './Home.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Channel } from '../../backendSrc/interface/channel';
import { Message } from '../../backendSrc/interface/message';
import { FaLock } from 'react-icons/fa';
import GuestChat from './GuestChat';

// Home-komponenten
const Guest: React.FC = () => {
    const navigate = useNavigate();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
  

    // Logga ut
    const handleLogUt = () => {
        localStorage.removeItem('username');
        navigate('/');
    };


    // Hämta data när komponenten laddas
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Hämta kanaler
                const channelResponse = await fetch('/api/channels');
                if (!channelResponse.ok) throw new Error('Kunde inte hämta kanaler');
                const channelsData = await channelResponse.json();
                setChannels(channelsData);


                // Hämta användarnamn från localStorage
                const storedUsername = localStorage.getItem('username');
                setUsername(storedUsername); 

            } catch (error) {
                console.error('Fel vid hämtning av data:', error);
            }
        };

        fetchData();
    }, []); // tom array för att useEffect ska köras en gång

    
    useEffect(() => {
        if (selected) {
            // Om selected är en kanal
            if (channels.some(channel => channel.name === selected)) {
                fetchMessages(selected);
            }
        }
    }, [selected]); // körs när selected ändras
    


    // Hämta meddelanden för en specifik kanal
    const fetchMessages = async (channelName: string) => {
        try {
            const response = await fetch(`/api/messages/channel/${channelName}`);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Fel status:', response.status, 'Respons:', errorText);
                throw new Error('Kunde inte hämta meddelanden');
            }
            // JSON
            const data = await response.json();
            
            setMessages(data || []); // Uppdaterar även om data är tom
        } catch (error) {
            console.error('Fel vid hämtning av meddelanden:', error);
        }
    };
    
    
    
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
                <h2 className="nav-item">Kanaler</h2>
                    <ul className="nav-list">
                        {channels.map(channel => (
                            <li key={channel.name} className="nav-item">
                                 <button 
                                    className={`channel-btn ${channel.isPrivate ? 'disabled' : ''}`} 
                                 
                                    onClick={() => {
                                        if (!channel.isPrivate) {
                                            setMessages([]); // Återställ meddelanden
                                            setSelected(channel.name); // Sätt kanalnamn
                                            fetchMessages(channel.name); // Hämta meddelanden
                                        }
                                    }}
                                    disabled={channel.isPrivate} >
                                    {channel.name}
                                    {channel.isPrivate && <FaLock className="private-icon" />} 
                                </button>
                            </li>
                        ))}
                        
                        <li className="nav-item"><hr /></li>  
                    </ul>
                </nav>
               
                    <GuestChat selected={selected} messages={messages} setMessages={setMessages}/>
                

                
            </main>
        </>
    );
};

export default Guest;


