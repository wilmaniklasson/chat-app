import express from 'express';
import { Request, Response } from 'express';
import { getDB } from '../dbConnection.js';
import { messageSchema } from '../Validete.js';

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


// Route för att hämta alla meddelanden i en specifik kanal
router.get('/channel/:channelName', async (req: Request, res: Response) => {
    const { channelName } = req.params;

    try {
        // Hämta meddelanden som matchar kanalens namn
        const messages = await getDB().collection('messages').find({ channelName }).toArray();
        
        // 404: Not Found
        if (messages.length === 0) {
            res.status(404).json({ error: 'No messages found in this channel' });
        } else {
            // JSON
            res.json(messages);
        }
    } catch (error) {
        // 500: Internal Server Error
        console.error('Error fetching messages for channel:', error);
        res.status(500).json({ error: 'Failed to fetch messages for channel' });
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


router.post('/', async (req: Request, res: Response) => {
    const { senderName, recipientName, channelName, content } = req.body;

    // Validera inkommande data
    const { error } = messageSchema.validate({ senderName, recipientName, channelName, content });
    if (error) {
         res.status(400).json({ error: error.details[0].message });
         return;
    }

    try {
        // Kontrollera om kanalen eller mottagaren finns
        if (channelName) {
            const channelExists = await getDB().collection('channels').findOne({ name: channelName });
            if (!channelExists) {
                 res.status(400).json({ error: 'Specified channel does not exist' });
                 return;
            }
        } else if (recipientName) {
            const userExists = await getDB().collection('users').findOne({ name: recipientName });
            if (!userExists) {
                 res.status(400).json({ error: 'Specified recipient does not exist' });
                 return;
            }
        }

        // Skapa nytt meddelandeobjekt
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
});


export default router;
