import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}

// Create a specific type for authenticated requests
export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
    };
}