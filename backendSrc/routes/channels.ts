import express from 'express';
import { getDB } from '../dbConnection.js';

const router = express.Router();

// Route för att hämta alla kanaler
router.get('/', async (req, res) => {
    try {
        const channels = await getDB().collection('channels').find().toArray();
        res.json(channels);
    } catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({ error: 'Failed to fetch channels' });
    }
});

// Här kan du lägga till fler kanalrelaterade rutter (skapa, uppdatera, ta bort kanaler etc.)

export default router;
