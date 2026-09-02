import { Request, Response } from 'express';
import { createParticipant } from '../services/participantService.js';

export async function registerParticipant(
    _req: Request,
    res: Response,
): Promise<void> {
    try {
        const participant = await createParticipant();

        res.status(201).json(participant);
    } catch (error) {
        console.error('Failed to create participant:', error);

        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Unable to create participant.',
        });
    }
}
