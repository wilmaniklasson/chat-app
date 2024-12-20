import express from 'express';
import { connectDB } from './dbConnection.js';
import usersRouter from './routes/users.js';
import messagesRouter from './routes/messages.js';
import channelsRouter from './routes/channels.js';
import logger from './logger.js';


const app = express();
const PORT = process.env.PORT || 1224;

// Ansluter till databasen
const startServer = async () => {
    try {
        await connectDB();
        console.log('Database connected successfully.');

        // Middleware för att hantera JSON-data
        app.use('/', express.static('dist/'));
        app.use(express.json());

        // logger-middleware
        app.use(logger);

        // Routes med /api prefix
        app.use('/api/users', usersRouter); 
        app.use('/api/messages', messagesRouter);
        app.use('/api/channels', channelsRouter);

        // Starta servern
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); // Avsluta processen om det uppstår ett fel
    }
};

// Starta servern
startServer();