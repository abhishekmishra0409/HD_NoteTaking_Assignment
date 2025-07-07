import { Document } from 'mongoose';

export interface INote extends Document {
    title: string;
    content: string;
    user: string;
    createdAt: Date;
    updatedAt: Date;
}