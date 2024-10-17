import express from 'express';
import { connectDB } from './dbConnection.js';
import usersRouter from './routes/users.js';
import messagesRouter from './routes/messages.js';
import channelsRouter from './routes/channels.js';

const app = express();
const PORT = process.env.PORT || 2412;

// Anslut till databasen
connectDB();

// Middleware för att hantera JSON-data
app.use(express.json());

// Använd rutter
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.use('/channels', channelsRouter);

// Startar servern
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
