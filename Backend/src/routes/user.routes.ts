import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller';
import { AuthenticatedRequest } from '../types/express';

const router = Router();

// Apply auth middleware to all user routes
router.use(auth);

// Profile routes with proper typing
router.route('/profile')
    .get((req, res) => getUserProfile(req as AuthenticatedRequest, res))
    .put((req, res) => updateUserProfile(req as AuthenticatedRequest, res));

export default router;