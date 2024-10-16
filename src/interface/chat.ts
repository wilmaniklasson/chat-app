import { ObjectId } from "mongodb";

export interface Message {
    _id: ObjectId;
    senderId: ObjectId;
    recipientId: ObjectId | null; 
    channelId: ObjectId | null; 
    content: string;
    timestamp: Date;
}
