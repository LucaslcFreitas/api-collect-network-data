import { prisma } from '../db/prisma.js';
import {
    generateParticipantToken,
    hashParticipantToken,
} from '../utils/token.js';

export interface CreateParticipantResult {
    participantId: string;
    token: string;
}

export async function createParticipant(): Promise<CreateParticipantResult> {
    const token = generateParticipantToken();
    const tokenHash = hashParticipantToken(token);

    const participant = await prisma.participant.create({
        data: {
            tokenHash,
        },
        select: {
            id: true,
        },
    });

    return {
        participantId: participant.id,
        token,
    };
}
