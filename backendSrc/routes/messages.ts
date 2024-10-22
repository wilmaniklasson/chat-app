import express from 'express';
import e, { Request, Response } from 'express';
import { getDB } from '../dbConnection.js';

const router = express.Router();

// Route för att hämta alla meddelanden
router.get('/', async (req: Request, res: Response) => {
    try {
        const messages = await getDB().collection('messages').find().toArray();
        if (messages.length === 0) {
            res.status(404).json({ error: 'No messages found' });
        }else{
        res.json(messages);
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});



export default router;
