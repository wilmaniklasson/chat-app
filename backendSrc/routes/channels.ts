import express from 'express';
import { Request, Response } from 'express';
import { getDB } from '../dbConnection.js';

const router = express.Router();

// Route för att hämta alla kanaler
router.get('/', async (req: Request, res: Response) => {
    try {
        const channels = await getDB().collection('channels').find().toArray();
        

        if (channels.length === 0) {
            res.status(404).json({ error: 'No channels found' });
        } else {
        res.json(channels);
        }
    } catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({ error: 'Failed to fetch channels' });
    }
});


//hämta en kanal med sitt namn 

router.get('/name/:name', async (req: Request, res: Response) => {
    const name = req.params.name;
    try {
        const channel = await getDB().collection('channels').findOne({
            name
        });
        if (!channel) {
            res.status(404).json({ error: 'Channel not found' });
        } else {
            res.json(channel);
        }
    } catch (error) {
        console.error('Error fetching channel:', error);
        res.status(500).json({ error: 'Failed to fetch channel' });
    }


});

router.post('/', async (req: Request, res: Response) => {
    const { name } = req.body;

  
    if (!name) {
        res.status(400).json({ error: 'Channel name is required' });
    } else {
        try {
            
            const newChannel = { name };
            const result = await getDB().collection('channels').insertOne(newChannel);

            
            res.status(201).json({ message: 'Channel created', channelId: result.insertedId });
        } catch (error) {
            console.error('Error creating channel:', error);
            res.status(500).json({ error: 'Failed to create channel' });
        }
    }
});





export default router;
