import './Home.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Channel } from '../../backendSrc/interface/channel';
import { Message } from '../../backendSrc/interface/message';
import { FaUnlock } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import Chat from './Chat';

// Home-komponenten
const Home: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<{ _id: string; username: string; password: string }[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [isPrivate, setisPrivate] = useState(false); 

    const handleCheckboxChange = () => {
        setisPrivate(!isPrivate); // Växla mellan låst och upplåst
    };
  

    // Logga ut
    const handleLogUt = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };


    // Hämta data när komponenten laddas
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
            } else {
                // Om selected är en användare (direktmeddelande)
                fetchProtectedMessages(selected);
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
    
 
    // Hämta skyddade meddelanden
    const fetchProtectedMessages = async (otherUsername: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Ingen token hittades');
                return;
            }
            const messagesResponse = await fetch(`/api/users/protected?username=${otherUsername}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!messagesResponse.ok) throw new Error('Kunde inte hämta meddelanden');
            // JSON
            const messagesData = await messagesResponse.json();

            setMessages(messagesData.messages || []); // Uppdaterar även om data är tom
        } catch (error) {
            console.error('Fel vid hämtning av skyddade meddelanden:', error);
        }
    };
    

    //lägg till kanal 
    // ta bort användare 
    
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
                                    className="channel-btn" 
                                    onClick={() => {
                                        setMessages([]); // Återställ meddelanden
                                        setSelected(channel.name); // Sätt kanalnamn
                                        fetchMessages(channel.name); // Hämta meddelanden
                                        }}>
                                    {channel.name}
                                    {channel.isPrivate && <FaUnlock className="open-private-icon" />} 
                                </button>
                            </li>
                        ))}
                        <li className="create-channel">
                            <label className="lock-checkbox">
                            {isPrivate ? <FaLock className="private-icon" /> : <FaUnlock className="open-private-icon" />}
                            <input
                                type="checkbox"
                                checked={isPrivate}
                                onChange={handleCheckboxChange} // Hantera checkboxens förändring
                            />
                        </label>

                            <input title="Skapa ny kanal" placeholder="Skapa ny kanal" />
                            <button>Lägg till</button>
                        </li>
                      
                        <li className="nav-item"><hr /></li>
                        <h2 className="nav-item">DM</h2>
                        {users.map(user => (
                            <li key={user._id} className="nav-item">
                                <button 
                                    className="DM-btn" 
                                    onClick={() => {
                                        setMessages([]); // Återställ meddelanden
                                        setSelected(user.username); // Sätt användarnamnet som kanalnamn
                                        fetchProtectedMessages(user.username); // Hämta skyddade meddelanden
                                    }}>
                                    {user.username}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
               
                    <Chat selected={selected} messages={messages} setMessages={setMessages}/>
                

                
            </main>
        </>
    );
};

export default Home;
