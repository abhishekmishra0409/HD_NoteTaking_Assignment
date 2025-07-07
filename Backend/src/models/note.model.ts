import mongoose, { Schema, Document } from 'mongoose';
import { INote } from '../interfaces/note.interface';

const noteSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<INote>('Note', noteSchema);