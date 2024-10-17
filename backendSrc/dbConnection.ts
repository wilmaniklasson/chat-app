import { MongoClient } from 'mongodb'; 
import dotenv from 'dotenv';

dotenv.config(); // Laddar variabler från .env-filen

// Hämtar CONNECTION_STRING och databasnamnet från .env-filen
const connectionString = process.env.CONNECTION_STRING as string | undefined;
const dbName = process.env.MONGODB_DB_NAME;

let client: MongoClient; // Variabel för MongoClient
let db: any; // Variabel för databasen

// Anslut till databasen
export async function connectDB() {
    try {
        // är CONNECTION_STRING definierad?
        if (!connectionString) {
            throw new Error('CONNECTION_STRING is not defined in environment variables');
        }

       
        client = new MongoClient(connectionString);

        // Ansluter till MongoDB
        await client.connect();

        // Loggar att anslutningen har lyckats
        console.log('Connected to MongoDB');

        // Väljer databasen i detta fall chappy
        db = client.db(dbName);
        console.log(`selected database: ${dbName}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// Hämta databasen
export function getDB() {
    if (!db) {
        console.warn('Warning: Database has not been initialized. Please connect to the database first.');
    } else {
        console.log('Returning data from database...');
    }
    return db;
}


export async function closeDB() {
    if (client) {
        await client.close();
        console.log('Database connection closed');
    } else {
        console.warn('No active database connection to close');
    }
}
