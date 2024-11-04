import express from 'express';
import { Request, Response } from 'express';
import { getDB } from '../dbConnection.js';


const router = express.Router();

// Route för att hämta alla kanaler
router.get('/', async (req: Request, res: Response) => {
    try {
        const channels = await getDB().collection('channels').find().toArray();
        // 404: Not Found
        if (channels.length === 0) {
            res.status(404).json({ error: 'No channels found' });
        } else {
            // JSON
            res.json(channels);
        }
    } catch (error) {
        // 500: Internal Server Error
        console.error('Error fetching channels:', error);
        res.status(500).json({ error: 'Failed to fetch channels' });
    }
});


// Route för att hämta en specifik kanal med namn
router.get('/name/:name', async (req: Request, res: Response) => {
    const name = req.params.name;
    try {
        const channel = await getDB().collection('channels').findOne({
            name
        });
        if (!channel) {
            // 404: Not Found
            res.status(404).json({ error: 'Channel not found' });
        } else {
            // JSON
            res.json(channel);
        }
    } catch (error) {
        // 500: Internal Server Error
        console.error('Error fetching channel:', error);
        res.status(500).json({ error: 'Failed to fetch channel' });
    }


});
// Route för att posta en ny kanal
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { name, isPrivate } = req.body;

    // Om name saknas
    if (!name) {
        res.status(400).json({ error: 'Channel name is required' });
        return;
    }

    try {
        const db = getDB();
        const existingChannel = await db.collection('channels').findOne({ name });

        if (existingChannel) {
            // 409: Conflict
            res.status(409).json({ error: 'Channel already exists' });
            return;
        }
        // Skapa ett nytt kanalobjekt
        const newChannel = { name, isPrivate };
        const result = await db.collection('channels').insertOne(newChannel);

        // 201: Created
        res.status(201).json({ message: 'Channel created', channelId: result.insertedId });
    } catch (error) {
        // 500: Internal Server Error
        console.error('Error creating channel:', error);
        res.status(500).json({ error: 'Failed to create channel' });
    }
});

export default router;
