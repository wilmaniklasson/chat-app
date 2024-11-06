import { MongoClient, Db } from 'mongodb'; 
import dotenv from 'dotenv';

dotenv.config(); // Laddar variabler från .env-filen

// Hämtar CONNECTION_STRING och databasnamnet från .env-filen
const connectionString = process.env.CONNECTION_STRING as string | undefined;
const dbName = process.env.MONGODB_DB_NAME;

let client: MongoClient | undefined; // Variabel för MongoClient
let db: Db | undefined; // Variabel för databasen

// Anslut till databasen
export async function connectDB(): Promise<void> {
    try {
        // Är CONNECTION_STRING definierad?
        if (!connectionString) {
            throw new Error('CONNECTION_STRING is not defined in environment variables');
        }

        if (!dbName) {
            throw new Error('Database name is not defined in environment variables');
        }

        // Skapar en ny MongoClient
        client = new MongoClient(connectionString);

        // Ansluter till MongoDB
        await client.connect();

        // Väljer databasen
        db = client.db(dbName);
        console.log('Successfully connected to the database');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error instanceof Error ? error.message : error);
    }
}

export function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Please connect to the database first.');
    }
    console.log('Returning data from database...');
    return db;
}


// Stäng anslutningen till databasen
export async function closeDB(): Promise<void> {
    if (client) {
        await client.close();
        console.log('Database connection closed');
    } else {
        console.warn('No active database connection to close');
    }
}
