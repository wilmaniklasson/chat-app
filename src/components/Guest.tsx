import './Home.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Channel } from '../../backendSrc/interface/channel';
import { FaLock } from 'react-icons/fa';



// Home-komponenten
const Guest: React.FC = () => {
    // Navigate-funktion från react-router-dom
    const navigate = useNavigate();
    // States för användare, kanaler och meddelanden
    const [users, setUsers] = useState<{ _id: string; username: string; password: string }[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    

    // Logga ut användaren
    const handleLogUt = () => {
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
                console.log(channelsData);
           

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
                    <span className="user-status-text">Inloggad som Gäst</span>
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
                                {channel.isPrivate ? (
                                    <span className="private-channel">
                                        {channel.name}
                                        <FaLock className="private-icon" />
                                    </span>
                                ) : (
                                    <a className="nav-link" href={`${channel.name}`}>
                                        {channel.name}
                                        {channel.isPrivate && <FaLock className="private-icon" />}
                                    </a>
                                )}
                            </li>
                        ))}
                        <li className="nav-item"><hr /></li>
                        <li className="nav-item" title="Direktmeddelanden">[DM]</li>
                        {users.map(user => (
                            <li key={user._id} className="nav-item">
                                {user.username}
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
                       
                            <section className="chat-message">
                               
                            </section>
                      
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

export default Guest;