import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const DeleteUserButton: React.FC = () => {
    // States
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    // Funktion för att radera användare
    const handleDeleteUser = async () => {
        try {
            // Hämta token från local storage
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Fel vid radering:", errorData);
            } else {
                await response.json();
                navigate('/'); // Navigera till startsidan
            }
      
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <>
            <button className='Delete-btn' onClick={() => setShowPopup(true)}>
                Ta bort konto
            </button>

          {/* Om showPopup är true, visa popup-fönstret */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Bekräfta borttagning</h2>
                        <p>Är du säker på att du vill ta bort ditt konto? Detta kan inte ångras.</p>
                        
                        {/* Knapp för att bekräfta borttagning */}
                        <button onClick={() => {
                            handleDeleteUser();
                            setShowPopup(false);
                        }}>
                            Ja, ta bort
                        </button>
                        {/* Knapp för att avbryta borttagning */}
                        <button onClick={() => setShowPopup(false)}>
                            Avbryt
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteUserButton;
