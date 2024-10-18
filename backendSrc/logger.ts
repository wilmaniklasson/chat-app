import { Request, Response, NextFunction } from 'express';

// Logger middleware för att logga inkommande förfrågningar
const logger = (req: Request, res: Response, next: NextFunction) => {
    const { method, url } = req;
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] ${method} request made to: ${url}`);

    // Fortsätt till nästa middleware eller route-handler
    next();
};

export default logger;
