import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const DeleteUserButton: React.FC = () => {
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const handleDeleteUser = async () => {
   
        try {
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
                navigate('/'); 
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

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Bekräfta borttagning</h2>
                        <p>Är du säker på att du vill ta bort ditt konto? Detta kan inte ångras.</p>
                        <button onClick={() => {
                            handleDeleteUser();
                            setShowPopup(false);
                        }}>
                            Ja, ta bort
                        </button>
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
