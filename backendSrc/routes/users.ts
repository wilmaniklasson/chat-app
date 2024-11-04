import express, { Request, Response, } from 'express';
import { getDB } from '../dbConnection.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { loginSchema, registerSchema, usernameSchema } from '../Validete.js';

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
            // 404: Not Found
            res.status(404).json({ error: 'No users found' });
        } else {
            // JSON
        res.json(users);
        }
        
    } catch (error) {
        // 500: Internal Server Error
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});




// Route för att logga in
router.post('/login', async (req: Request, res: Response) => { 
    const { error } = loginSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    console.log('Login request received:', req.body);
    const { username, password }: { username: string; password: string } = req.body;
    try {
        // leta efter användaren i databasen
        const user = await getDB().collection('users').findOne({ username });

        // Kontrollera om användaren finns och om lösenordet stämmer
        if (user && user.password === password) {
            // Skapa JWT-token
            const token = jwt.sign({ id: user._id }, JWT_SECRET,);
            
            // Returnerar användarens ID, namn och token
            res.json({ _id: user._id, username: user.username, token });
        } else {
            // 401: Unauthorized
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        // 500: Internal Server Error
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});



router.get('/protected', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { username: otherUsername } = req.query;
    if (!token) {
        // 401: Unauthorized
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

            if (user) {
                const username = user.username;
                const messages = await getDB().collection('messages').find({
                    $or: [
                        { senderName: username, recipientName: otherUsername },
                        { senderName: otherUsername, recipientName: username }
                    ]
            })
            .sort({ timestamp: 1 }) // Sortera meddelanden efter tid
            .toArray();
            
            console.log('Messages:', messages);
            
            // Returnera både användarinformation och meddelanden
            res.json({ user, messages });
        } else {
            // 404: Not Found
            res.status(404).json({ error: 'User not found' });
        }
    } 
    } catch (error) {
        // 401: Unauthorized
        console.error('Error verifying token or fetching user/messages:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});


// Hämta användare med ett visst användarnamn
router.get('/username/:username', async (req: Request, res: Response) => {
    const { error } = usernameSchema.validate(req.params); 
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    const username = req.params.username;
    try {
        const user = await getDB().collection('users').findOne({
            username
        });
        if (!user) {
            // 404: Not Found
            res.status(404).json({ error: 'User not found' });
        } else {
            // JSON
            res.json(user);
        }
    } catch (error) {
        // 500: Internal Server Error
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

router.delete('/delete', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];

    // Kontrollera så att token inte saknas
    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    try {
        // Verifiera token och få användarens ID
        const payload = jwt.verify(token, JWT_SECRET) as { id: string };
        const _id = new ObjectId(payload.id);

        // Ta bort användaren från databasen
        const deleteResult = await getDB().collection('users').deleteOne({ _id });

        if (deleteResult.deletedCount === 0) {
            // 404: Not Found
            res.status(404).json({ error: 'User not found' });
        } else {
            // JSON
            res.json({ message: 'User successfully deleted' });
        }
    } catch (error) {
        console.error('Error verifying token or deleting user:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});





// Registrera användare
router.post('/register', async (req: Request, res: Response) => {

    const { error } = registerSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    const { username, password } = req.body;


    if (!username || !password) {
        // 400: Bad Request
        res.status(400).json({ error: 'Username and password are required' });
    } else {
        try {
            // Kontrollera om användarnamnet redan finns
            const existingUser = await getDB().collection('users').findOne({ username });
            if (existingUser) {
                // 409: Conflict
                res.status(409).json({ error: 'Username already exists' });
            } else {
                // Skapa ny användare
                const newUser = { username, password }; 
                const result = await getDB().collection('users').insertOne(newUser);

                // Skapa JWT-token
                const token = jwt.sign({ id: result.insertedId }, JWT_SECRET);

                // 201: Created
                res.status(201).json({ message: 'User created', token, username });
            }
        } catch (error) {
            console.error('Error creating user:', error);
            // 500: Internal Server Error
            res.status(500).json({ error: 'Failed to create user' });
        }
    }
});

export default router;

