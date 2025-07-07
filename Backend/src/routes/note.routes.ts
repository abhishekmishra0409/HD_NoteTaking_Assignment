import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import {
    getNotes,
    createNote,
    getNoteById,
    updateNote,
    deleteNote,
} from '../controllers/note.controller';
import { AuthenticatedRequest } from '../types/express';

const router = Router();

// Apply auth middleware to all note routes
router.use(auth);

// Route definitions
router.route('/')
    .get((req, res) => getNotes(req as AuthenticatedRequest, res))
    .post((req, res) => createNote(req as AuthenticatedRequest, res));

router.route('/:id')
    .get((req, res) => getNoteById(req as AuthenticatedRequest, res))
    .put((req, res) => updateNote(req as AuthenticatedRequest, res))
    .delete((req, res) => deleteNote(req as AuthenticatedRequest, res));

export default router;