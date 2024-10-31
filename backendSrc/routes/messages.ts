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
        const messages = await getDB().collection('messages')
        .find({ recipientName: channelName }) 
        .sort({ timestamp: 1 }) // Sortera meddelanden efter tid
        .toArray();
        
        res.json(messages.length > 0 ? messages : []); // Returnera tom array om inga meddelanden hittades
    } catch (error) {
        // 500: Internal Server Error
        console.error('Error fetching messages for channel:', error);
        res.status(500).json({ error: 'Failed to fetch messages for channel' });
    }
});



// Route för att skicka meddelanden
router.post('/', async (req: Request, res: Response) => {
    const { senderName, recipientName, content } = req.body;
    const { error } = messageSchema.validate({ senderName, recipientName, content });
    if (error) {
        console.error('Valideringsfel:', error.details[0].message);
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    try {
        // Är recipientName är en kanal
        const isChannel = await getDB().collection('channels').findOne({ name: recipientName });
        
        // Är recipientName är en användare med ett username
        let isUser = null;
        if (!isChannel) {
            isUser = await getDB().collection('users').findOne({ username: recipientName });
        }

        if (!isChannel && !isUser) {
            res.status(400).json({ error: 'Specified recipient does not exist' });
            return;
        }
        
        // Nytt meddelande
        const newMessage = {
            senderName,
            recipientName,
            content,
            timestamp: new Date()
        };
        // Lägg till meddelandet i databasen
        const result = await getDB().collection('messages').insertOne(newMessage);
    
         // Hämta alla meddelanden för mottagaren (kanalen eller användaren)
         const messages = await getDB().collection('messages')
         .find({ recipientName })
         .sort({ timestamp: 1 })
         .toArray();

     // Returnera alla meddelanden i chatten
     res.status(201).json(messages);

    } catch (error) {
        // 500: Internal Server Error
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});


export default router;
