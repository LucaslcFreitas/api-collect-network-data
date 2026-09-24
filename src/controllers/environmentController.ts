import { Request, Response } from 'express';
import { environmentValueSchema } from '../schemas/environmentSchema.js';
import {
    addMorphology,
    addTopography,
    getEnvironment,
} from '../services/environmentService.js';

export async function getEnvironmentOptions(
    _req: Request,
    res: Response,
): Promise<void> {
    try {
        res.json(await getEnvironment());
    } catch (error) {
        console.error('Environment lookup failed:', error);
        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Unable to retrieve environment options.',
        });
    }
}

async function addEnvironmentValue(
    req: Request,
    res: Response,
    addValue: (value: string) => Promise<void>,
): Promise<void> {
    try {
        const validation = environmentValueSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({
                error: 'INVALID_REQUEST',
                message: 'Environment value must be a non-empty string.',
                details: validation.error.issues,
            });

            return;
        }

        await addValue(validation.data.environment);
        res.json(await getEnvironment());
    } catch (error) {
        console.error('Environment update failed:', error);
        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Unable to update environment options.',
        });
    }
}

export function addMorphologyOption(req: Request, res: Response): Promise<void> {
    return addEnvironmentValue(req, res, addMorphology);
}

export function addTopographyOption(req: Request, res: Response): Promise<void> {
    return addEnvironmentValue(req, res, addTopography);
}