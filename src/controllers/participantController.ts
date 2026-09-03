import { Request, Response } from 'express';
import {
    createParticipant,
    getParticipant,
} from '../services/participantService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { updateParticipant } from '../services/participantService.js';
import { updateParticipantSchema } from '../schemas/participantSchema.js';

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

export async function getMe(req: Request, res: Response): Promise<void> {
    try {
        const authenticatedRequest = req as AuthenticatedRequest;

        const participantId = authenticatedRequest.participantId;

        if (!participantId) {
            res.status(401).json({
                error: 'UNAUTHORIZED',
            });

            return;
        }

        const participant = await getParticipant(participantId);

        if (!participant) {
            res.status(404).json({
                error: 'PARTICIPANT_NOT_FOUND',
            });

            return;
        }

        res.status(200).json({
            participant,
        });
    } catch (error) {
        console.error('Failed to retrieve participant:', error);

        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Unable to retrieve participant information.',
        });
    }
}

export async function updateMe(req: Request, res: Response): Promise<void> {
    try {
        const authenticatedRequest = req as AuthenticatedRequest;

        const participantId = authenticatedRequest.participantId;

        if (!participantId) {
            res.status(401).json({
                error: 'UNAUTHORIZED',
            });

            return;
        }

        const validation = updateParticipantSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({
                error: 'INVALID_REQUEST',
                message: 'Invalid participant information.',
                details: validation.error.issues,
            });

            return;
        }

        const participant = await updateParticipant(
            participantId,
            validation.data,
        );

        res.status(200).json({
            participant,
        });
    } catch (error) {
        console.error('Failed to update participant:', error);

        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Unable to update participant information.',
        });
    }
}
