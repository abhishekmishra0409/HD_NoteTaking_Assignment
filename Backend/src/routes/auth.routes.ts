import { Router } from 'express';
import { register, verifyOTP, login, googleAuth } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/google', googleAuth);

export default router;