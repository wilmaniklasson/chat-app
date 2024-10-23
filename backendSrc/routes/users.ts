import express, { Request, Response } from 'express';
import { getDB } from '../dbConnection.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';

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
            const token = jwt.sign({ id: user._id }, JWT_SECRET,);
            
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



router.get('/protected', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    try {
        // Verifiera token och få användarens ID
        const payload = jwt.verify(token, JWT_SECRET) as { id: string };
        const _id = payload.id; // Hämta ID från payload

        // Hämta användaren från databasen
        const user = await getDB().collection('users').findOne({ _id: new ObjectId(_id) });
        console.log('User from database:', user);
        
        if (user) {
            // Hämta användarens namn
            const username = user.username; 

            // Hämta meddelanden som tillhör användaren
            const messages = await getDB().collection('messages').find({
                $or: [
                    { senderName: username },  
                    { recipientName: username } 
                ]
            }).toArray();
            
            console.log('Messages:', messages);
            
            // Returnera både användarinformation och meddelanden
            res.json({ user, messages });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error verifying token or fetching user/messages:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});


export default router;

