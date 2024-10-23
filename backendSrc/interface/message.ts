import { ObjectId } from "mongodb";

export interface Message {
    _id: ObjectId;
    senderName: string;
    recipientName: string | null; 
    channelName: string | null; 
    content: string;
    timestamp: Date;
}
