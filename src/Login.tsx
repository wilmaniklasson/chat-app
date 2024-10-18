import React, { useState } from 'react';

import "./Loggin.css";

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const data = { username, password }; // Samla in användarnamn och lösenord
        console.log('Skickar data till server:', JSON.stringify(data)); // Logga data som skickas
    
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // Konvertera data till JSON-sträng
            });
    
            console.log('Response status:', response.status); // Loggar status
            
            // Är svaret ok?
            if (!response.ok) {
                const errorData = await response.json(); // Hämta felmeddelande
                console.error('Fel från server:', errorData); // Loggar felmeddelande från servern
                throw new Error(errorData.error || 'Något gick fel');
            }
    
            // Hämta JSON datan från svaret
            const result = await response.json();
            console.log('Inloggad:', result);

            // Spara token i localStorage
            localStorage.setItem('token', result.token);
            setMessage('Inloggning lyckades!'); 
    
        } catch (error: any) {
            console.error('Error vid inloggning:', error); // Logga eventuella fel
            setMessage(error.message); // Felmeddelande
        }
    };
    
    

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Logga in</h2>
                <input
                    type="text"
                    placeholder="Användarnamn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Lösenord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className='logg-in-btn' type="submit">Logga in</button>
                <button className='logg-ut-btn'>Logga ut</button>
                {message && (
                    <div className={`message ${message.includes('lyckades') ? 'success' : 'error'}`}>
                        {message}
                        
                    </div>
                )}
         
            </form>
        </div>
    );
};

export default Login;
