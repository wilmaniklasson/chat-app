import express from 'express';
import { Request, Response } from 'express';
import { getDB } from '../dbConnection.js';
import { messageSchema } from '../Validete.js';
import { Message } from '../interface/message.js';
import { WithId, Document} from 'mongodb';

const router = express.Router();


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
router.post('/', async (req: Request<{}, {}, Message>, res: Response) => {
    const { senderName, recipientName, content } = req.body;
    

    const { value, error } = messageSchema.validate({ senderName, recipientName, content });
    if (error) {
        console.error('Valideringsfel:', error.details[0].message);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    
    // Destrukturering värdena från value
    const { senderName: validSenderName, recipientName: validRecipientName, content: validContent } = value;

    try {
        // Är recipientName är en kanal
        const isChannel = await getDB().collection('channels').findOne({ name: recipientName });
        
        // isUser kan va ett MongoDB-dokument med ID eller null
        let isUser: WithId<Document> | null = null;

        if (!isChannel) {
            isUser = await getDB().collection('users').findOne({ username: recipientName });
        }

        if (!isChannel && !isUser) {
            res.status(400).json({ error: 'Specified recipient does not exist' });
            return;
        }
        
        // Nytt meddelande
        const newMessage = {
            senderName: validSenderName,
            recipientName: validRecipientName,
            content: validContent,
            timestamp: new Date()
        };
        // Lägg till meddelandet i databasen
        const result = await getDB().collection('messages').insertOne(newMessage);
    
         // Hämta alla meddelanden för mottagaren (kanalen eller användaren)
         const messages = await getDB().collection('messages')
         .find({ recipientName: validRecipientName })
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
