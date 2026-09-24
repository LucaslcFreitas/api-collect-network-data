import { Request, Response } from 'express';
import { checkDatabase } from '../db/mongodb.js';

export async function healthCheck(_req: Request, res: Response): Promise<void> {
    try {
        await checkDatabase();

        res.status(200).json({
            status: 'ok',
            database: 'ok',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Health check failed:', error);

        res.status(503).json({
            status: 'error',
            database: 'unavailable',
            timestamp: new Date().toISOString(),
        });
    }
}
