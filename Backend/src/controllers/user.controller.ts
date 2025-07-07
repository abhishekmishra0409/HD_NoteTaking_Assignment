import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import userService from '../services/user.service';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await userService.getUserProfile(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    const { name, email } = req.body;

    try {
        const user = await userService.updateUserProfile(req.user.id, name, email);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export { getUserProfile, updateUserProfile };