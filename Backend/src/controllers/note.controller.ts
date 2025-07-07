import { Request, Response } from 'express';
import noteService from '../services/note.service';
import { AuthenticatedRequest } from '../types/express';


// @desc    Get all notes
// @route   GET /api/notes
// @access  Private
const getNotes = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const notes = await noteService.getNotes(req.user.id);
        res.status(200).json(notes);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req: AuthenticatedRequest, res: Response) => {
    const { title, content } = req.body;
    try {
        const note = await noteService.createNote(title, content, req.user.id);
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

// @desc    Get a single note
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const note = await noteService.getNoteById(req.params.id, req.user.id);
        res.status(200).json(note);
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req: AuthenticatedRequest, res: Response) => {
    const { title, content } = req.body;

    try {
        const note = await noteService.updateNote(
            req.params.id,
            title,
            content,
            req.user.id
        );
        res.status(200).json(note);
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
    try {
        await noteService.deleteNote(req.params.id, req.user.id);
        res.status(200).json({ message: 'Note removed' });
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
};

export { getNotes, createNote, getNoteById, updateNote, deleteNote };