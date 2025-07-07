import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '7d',
    });
};
