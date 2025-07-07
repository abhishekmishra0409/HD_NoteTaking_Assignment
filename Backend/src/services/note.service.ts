import Note from '../models/note.model';
import {INote} from "../interfaces/note.interface";

class NoteService {
    // Create a new note
    async createNote(title: string, content: string, userId: string) {
        const note = await Note.create({
            title,
            content,
            user: userId,
        });

        return note;
    }

    // Get all notes for a user
    async getNotes(userId: string) {
        const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
        return notes;
    }

    // Get a single note
    async getNoteById(noteId: string, userId: string) {
        const note = await Note.findOne({ _id: noteId, user: userId });

        if (!note) {
            throw new Error('Note not found');
        }

        return note;
    }

    // Update a note
    async updateNote(noteId: string, title: string, content: string, userId: string) {
        const note = await Note.findOne({ _id: noteId, user: userId }) as INote;

        if (!note) {
            throw new Error('Note not found');
        }

        note.title = title || note.title;
        note.content = content || note.content;
        await note.save();

        return note;
    }

    // Delete a note
    async deleteNote(noteId: string, userId: string) {
        const note = await Note.findOneAndDelete({ _id: noteId, user: userId }) as INote;

        if (!note) {
            throw new Error('Note not found');
        }

        return note;
    }
}

export default new NoteService();