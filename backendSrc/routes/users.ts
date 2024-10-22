import express, { Request, Response } from 'express';
import { getDB } from '../dbConnection.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Ladda in miljövariabler från .env-filen

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
}

// Route för att hämta alla användare
router.get('/', async (req: Request, res: Response) => { 
    try {
        const users = await getDB().collection('users').find().toArray();
        if (users.length === 0) {
            res.status(404).json({ error: 'No users found' });
        } else {
        res.json(users);
        }
        
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Route för inloggning
router.post('/login', async (req: Request, res: Response) => { 
    console.log('Login request received:', req.body);
    const { username, password }: { username: string; password: string } = req.body;
    try {
        // leta efter användaren i databasen
        const user = await getDB().collection('users').findOne({ username });

        // Kontrollera om användaren finns och om lösenordet stämmer
        if (user && user.password === password) {
            // Skapa JWT-token
            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' }); // Token gäller i 1 timme
            
            // Returnerar användarens ID och token
            res.json({ _id: user._id, token });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;
