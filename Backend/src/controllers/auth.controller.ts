import { Request, Response } from 'express';
import authService from '../services/auth.service';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const user = await authService.register(name, email, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    try {
        const user = await authService.verifyOTP(email, otp);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await authService.login(email, password);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ message: (error as Error).message });
    }
};

// @desc    Google authentication
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
        const user = await authService.googleAuth(token);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ message: (error as Error).message });
    }
};

export { register, verifyOTP, login, googleAuth };