import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma.js';
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

        const participant = await prisma.participant.findUnique({
            where: {
                tokenHash,
            },
            select: {
                id: true,
                status: true,
            },
        });

        if (!participant || participant.status !== 'ACTIVE') {
            res.status(401).json({
                error: 'UNAUTHORIZED',
                message: 'Invalid participant token.',
            });

            return;
        }

        (req as AuthenticatedRequest).participantId = participant.id;

        await prisma.participant.update({
            where: {
                id: participant.id,
            },
            data: {
                lastSeenAt: new Date(),
            },
        });

        next();
    } catch (error) {
        console.error('Authentication error:', error);

        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Authentication failed.',
        });
    }
}
