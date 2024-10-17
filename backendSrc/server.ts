import express from 'express';
import { connectDB } from './dbConnection.js';
import usersRouter from './routes/users.js';
import messagesRouter from './routes/messages.js';
import channelsRouter from './routes/channels.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 1224;

// Anslut till databasen
connectDB();


app.use(cors());
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
