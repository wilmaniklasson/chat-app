import express from 'express';
import { getDB } from '../dbConnection.js';

const router = express.Router();

// Route för att hämta alla meddelanden
router.get('/', async (req, res) => {
    try {
        const messages = await getDB().collection('messages').find().toArray();
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});



export default router;
