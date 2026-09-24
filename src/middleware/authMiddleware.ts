import { Request, Response, NextFunction } from 'express';
import { getCollections } from '../db/mongodb.js';
import { hashParticipantToken } from '../utils/token.js';

export interface AuthenticatedRequest extends Request {
    participantId?: string;
}

export async function authenticateParticipant(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            res.status(401).json({
                error: 'UNAUTHORIZED',
                message: 'Authorization header is required.',
            });

            return;
        }

        const [scheme, token] = authorization.split(' ');

        if (scheme !== 'Bearer' || !token || token.length < 20) {
            res.status(401).json({
                error: 'UNAUTHORIZED',
                message: 'Invalid authorization header.',
            });

            return;
        }

        const tokenHash = hashParticipantToken(token);

        const { participants } = await getCollections();
        const participant = await participants.findOne(
            { tokenHash },
            { projection: { _id: 1, status: 1 } },
        );

        if (!participant || participant.status !== 'ACTIVE') {
            res.status(401).json({
                error: 'UNAUTHORIZED',
                message: 'Invalid participant token.',
            });

            return;
        }

        (req as AuthenticatedRequest).participantId = participant._id;

        await participants.updateOne(
            { _id: participant._id },
            { $set: { lastSeenAt: new Date() } },
        );

        next();
    } catch (error) {
        console.error('Authentication error:', error);

        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Authentication failed.',
        });
    }
}
