import './App.css';
import { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [loginMessage, setLoginMessage] = useState(''); 

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:2412/auth/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
    
      if (!response.ok) {
        throw new Error('Login failed');
      }
    
      const data = await response.json();
      localStorage.setItem('token', data.token); // Spara token i local storage
      setUserId(data.userId);
      setLoginMessage('Logged in successfully!'); // Meddelande vid lyckad inloggning
      console.log('Logged in:', data);
    } catch (error) {
      console.error(error);
      setLoginMessage('Login failed. Please try again.'); // Meddelande vid inloggningsfel
    }
  };
  

  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem('token');
    setLoginMessage(''); // Rensa meddelande vid utloggning
    console.log('Logged out');
  };

  return (
    <>
      <header>
        <h1>Chappy chat app!</h1>
      </header>
      <main>
        <div className='loggin'>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button id="login-button" onClick={handleLogin}>Log in</button>
          <button id="logout-button" onClick={handleLogout}>Log out</button>
          {userId && <p>Logged in as: {userId}</p>}
          {loginMessage && <p>{loginMessage}</p>} {/* Visa inloggningsmeddelandet */}
        </div>
      </main>
    </>
  );
}

export default App;
