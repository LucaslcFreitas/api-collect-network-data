import { Request, Response } from 'express';
import { batchSchema } from '../schemas/batchSchema.js';
import { createBatch } from '../services/batchService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export async function uploadBatch(req: Request, res: Response): Promise<void> {
    try {
        const authenticatedRequest = req as AuthenticatedRequest;

        const participantId = authenticatedRequest.participantId;

        if (!participantId) {
            res.status(401).json({
                error: 'UNAUTHORIZED',
                message: 'Participant authentication required.',
            });

            return;
        }

        const validation = batchSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({
                error: 'INVALID_REQUEST',
                message: 'Invalid measurement data.',
                details: validation.error.issues,
            });

            return;
        }

        const result = await createBatch(participantId, validation.data);

        res.status(201).json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error('Batch upload failed:', error);

        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Unable to store measurement batch.',
        });
    }
}
