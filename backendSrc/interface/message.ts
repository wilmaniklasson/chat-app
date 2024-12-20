import { ObjectId } from "mongodb";

export interface Message {
    _id: ObjectId;
    senderName: string;
    recipientName: string;
    content: string;
    timestamp: Date;
}
