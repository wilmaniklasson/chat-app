import { ObjectId } from "mongodb";

export interface Channel {
    _id: ObjectId;
    name: string;
    isPrivate: boolean;
}
