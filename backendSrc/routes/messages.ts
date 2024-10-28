import express from 'express';
import { Request, Response } from 'express';
import { getDB } from '../dbConnection.js';

const router = express.Router();

// Route för att hämta alla meddelanden
router.get('/', async (req: Request, res: Response) => {
    try {
        const messages = await getDB().collection('messages').find().toArray();
        // 404: Not Found
        if (messages.length === 0) {
            res.status(404).json({ error: 'No messages found' });
        }else{
            // JSON
        res.json(messages);
        }
    } catch (error) {
        // 500: Internal Server Error
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});



// Route för att hämta alla meddelanden mellan två användare
router.get('/between-users', async (req: Request, res: Response) => {
    const { user1, user2 } = req.query;

    try {
        // Filtrerar ut meddelanden som matchar användarnamnen
        const filter = {
            $or: [
                { senderName: user1, recipientName: user2 },
                { senderName: user2, recipientName: user1 }
            ]
        };

        // Hämta meddelanden som matchar filtret
        const messages = await getDB().collection('messages').find(filter).toArray();

        // 404: Not Found
        if (messages.length === 0) {
            res.status(404).json({ error: 'No messages found between these users' });
        } else {
            // JSON
            res.json(messages);
        }
    } catch (error) {
        // 500: Internal Server Error
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});



// Route för att posta ett nytt meddelande
router.post('/', async (req: Request, res: Response) => {
    const { senderName, recipientName, channelName, content } = req.body;

    // Om senderName, recipientName, channelName eller content saknas
    if (!senderName || (!recipientName && !channelName) || !content) {
        res.status(400).json({ error: 'Missing required fields' });
    } else {
        try {
            const newMessage = {
                senderName,
                recipientName: recipientName || null,
                channelName: channelName || null,
                content,
                timestamp: new Date() 
            };

            // Lägg till meddelandet i databasen
            const result = await getDB().collection('messages').insertOne(newMessage);

            // 201: Created
            res.status(201).json({ message: 'Message sent successfully', id: result.insertedId });
        } catch (error) {
            // 500: Internal Server Error
            console.error('Error sending message:', error);
            res.status(500).json({ error: 'Failed to send message' });
        }
    }
});


export default router;
