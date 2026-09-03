import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { dataQuerySchema } from '../schemas/dataQuerySchema.js';
import { getParticipantData } from '../services/dataService.js';

export async function getMyData(req: Request, res: Response): Promise<void> {
    try {
        const authenticatedRequest = req as AuthenticatedRequest;

        const participantId = authenticatedRequest.participantId;

        if (!participantId) {
            res.status(401).json({
                error: 'UNAUTHORIZED',
            });

            return;
        }

        const validation = dataQuerySchema.safeParse(req.query);

        if (!validation.success) {
            res.status(400).json({
                error: 'INVALID_REQUEST',
                message: 'Invalid pagination parameters.',
                details: validation.error.issues,
            });

            return;
        }

        const result = await getParticipantData(
            participantId,
            validation.data.page,
            validation.data.limit,
        );

        res.status(200).json(result);
    } catch (error) {
        console.error('Failed to retrieve participant data:', error);

        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Unable to retrieve participant data.',
        });
    }
}
