import './Home.css';
import { useNavigate } from 'react-router-dom';


const Home: React.FC = () => {

const navigate = useNavigate(); 

    const  handleLogUt = () => {
        console.log('Loggar ut')
        localStorage.removeItem('token')
        navigate('/')
    }
    return (
        <>
        <header className="header-container">
    <h1 className="header-title">Chappy</h1>
    <div className="user-status-container">
        <span className="user-status-text">Inloggad som Alice</span>
        <button onClick={handleLogUt}
        className="logut-button">Logga ut</button>
    </div>
</header>
<main className='home-main'>
    <nav className="nav-container">
        <ul className="nav-list">
            <li className="nav-item">[Kanaler]</li>
            <li className="nav-item"><a className="nav-link" href="#">#koda</a></li>
            <li className="nav-item"><a className="nav-link" href="#">#random</a> <span className="unread">3</span></li>
            <li className="nav-locked nav-item"><a className="nav-link" href="#">#grupp1 🔒</a></li>
            <li className="nav-selected nav-item"><a className="nav-link" href="#">#grupp2 🔑</a></li>
            <li className="nav-locked nav-item"><a className="nav-link" href="#">#grupp3 🔒</a></li>
            <input title="Skapa ny kanal" placeholder="Skapa ny kanal">
            </input>
            <button> Lägg till</button>
            <li className="nav-item"><hr /></li>
            <li className="nav-item" title="Direktmeddelanden">[DM]</li>
            <li className="nav-item"><a className="nav-link" href="#">PratgladPelle</a></li>
            <li className="nav-item"><a className="nav-link" href="#">SocialaSara</a></li>
            <li className="nav-item"><a className="nav-link" href="#">TrevligaTommy</a></li>
            <li className="nav-item"><a className="nav-link" href="#">VänligaVera</a></li>
            <li className="nav-item"><a className="nav-link" href="#">GladaGustav</a></li>
        </ul>
    </nav>
    <div className="chat-container">
        <section className="chat-header">
            Chattar i <span className="chat-name">#grupp2</span>
        </section>
        <section className="chat-history">
            <section className="chat-message-right">
                <p>Alice:</p>
                <p className='text'>Hej på er!</p>
                <p className='time'> 17:46</p>
            </section>
            <section className="chat-message-left">
                <p>Moa:</p>
                <p className='text'>Hej!</p>
                <p className='time'>17:47</p>
            </section>
            <section className="chat-message-right">
                <p>Gustav:</p>
                <p className='text'>Hej på er!</p>
                <p className='time'> 17:48</p>
            </section>
        </section>
        <section>
            <input type="text" className="chat-input" placeholder="Ditt meddelande..." />
            <button className="send-button">Skicka</button>
        </section>
    </div>
</main></>
    );
};

export default Home;
