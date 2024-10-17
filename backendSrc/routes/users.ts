import express from 'express';
import { getDB } from '../dbConnection.js';

const router = express.Router();

// Route för att hämta alla användare
router.get('/', async (req, res) => {
    try {
        const users = await getDB().collection('users').find().toArray();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Här kan du lägga till fler användarrelaterade rutter (skapa, uppdatera, ta bort användare etc.)

export default router;
