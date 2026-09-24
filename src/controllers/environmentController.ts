import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import {
    addMorphology,
    addTopography,
    getEnvironments,
} from '../services/environmentService.js';
import { environmentSchema } from '../schemas/environmentSchema.js';

function isDuplicateEnvironment(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError
        && error.code === 'P2002';
}

export async function getEnvironment(_req: Request, res: Response): Promise<void> {
    try {
        res.status(200).json(await getEnvironments());
    } catch (error) {
        console.error('Failed to retrieve environments:', error);
        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Unable to retrieve environments.',
        });
    }
}

async function addEnvironment(
    req: Request,
    res: Response,
    add: typeof addMorphology,
): Promise<void> {
    const validation = environmentSchema.safeParse(req.body);

    if (!validation.success) {
        res.status(400).json({
            error: 'INVALID_REQUEST',
            message: 'Invalid environment information.',
            details: validation.error.issues,
        });
        return;
    }

    try {
        res.status(201).json(await add(validation.data));
    } catch (error) {
        if (isDuplicateEnvironment(error)) {
            res.status(409).json({
                error: 'ENVIRONMENT_ALREADY_EXISTS',
                message: 'This environment already exists.',
            });
            return;
        }

        console.error('Failed to add environment:', error);
        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Unable to add environment.',
        });
    }
}

export function addMorphologyEnvironment(req: Request, res: Response): Promise<void> {
    return addEnvironment(req, res, addMorphology);
}

export function addTopographyEnvironment(req: Request, res: Response): Promise<void> {
    return addEnvironment(req, res, addTopography);
}