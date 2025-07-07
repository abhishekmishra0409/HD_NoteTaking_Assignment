import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    mongoUri: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    googleClientId: string;
    googleClientSecret: string;
    otpExpiryMinutes: number;
    smtp: {
        host: string;
        port: number;
        username: string;
        password: string;
    };
    frontendUrl: string;
}

const config: Config = {
    port: parseInt(process.env.PORT || '3001'),
    mongoUri: process.env.MONGODB_URI || '',
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    otpExpiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '5'),
    smtp: {
        host: process.env.SMTP_HOST || '',
        port: parseInt(process.env.SMTP_PORT || '587'),
        username: process.env.SMTP_USERNAME || '',
        password: process.env.SMTP_PASSWORD || '',
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

export default config;