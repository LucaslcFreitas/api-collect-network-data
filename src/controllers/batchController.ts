import { Request, Response } from 'express';
import { batchSchema } from '../schemas/batchSchema.js';
import { createBatch } from '../services/batchService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { getBatches, getMeasurements } from '../services/dataService.js';
import {
    batchIdSchema,
    participantIdSchema,
} from '../schemas/adminDataSchema.js';

export async function getBatchesController(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const validation = participantIdSchema.safeParse(req.query);

        if (!validation.success) {
            res.status(400).json({
                error: 'INVALID_REQUEST',
                message: 'A valid participantId is required.',
                details: validation.error.issues,
            });
            return;
        }

        res.status(200).json(await getBatches(validation.data.participantId));
    } catch (error) {
        console.error('Failed to retrieve participant batches:', error);
        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Unable to retrieve participant batches.',
        });
    }
}

export async function getMeasurementsController(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const validation = batchIdSchema.safeParse(req.query);

        if (!validation.success) {
            res.status(400).json({
                error: 'INVALID_REQUEST',
                message: 'A valid batchId is required.',
                details: validation.error.issues,
            });
            return;
        }

        res.status(200).json(await getMeasurements(validation.data.batchId));
    } catch (error) {
        console.error('Failed to retrieve batch measurements:', error);
        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Unable to retrieve batch measurements.',
        });
    }
}

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

        if (
            error instanceof Error &&
            error.message.includes('Unique constraint')
        ) {
            res.status(409).json({
                error: 'BATCH_ALREADY_EXISTS',
                message: 'A batch with this clientBatchId already exists.',
            });

            return;
        }

        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Unable to store measurement batch.',
        });
    }
}
