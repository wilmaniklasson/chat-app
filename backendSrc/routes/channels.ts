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



export default router;
