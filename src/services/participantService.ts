import { prisma } from '../db/prisma.js';
import {
    generateParticipantToken,
    hashParticipantToken,
} from '../utils/token.js';
import type { UpdateParticipantInput } from '../schemas/participantSchema.js';

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

export async function getParticipant(participantId: string) {
    return prisma.participant.findUnique({
        where: {
            id: participantId,
        },

        select: {
            id: true,
            appVersion: true,
            deviceModel: true,
            os: true,
            status: true,
            createdAt: true,
            lastSeenAt: true,
        },
    });
}

export async function updateParticipant(
    participantId: string,
    data: UpdateParticipantInput,
) {
    return prisma.participant.update({
        where: {
            id: participantId,
        },

        data,

        select: {
            id: true,
            appVersion: true,
            deviceModel: true,
            os: true,
            status: true,
            createdAt: true,
            lastSeenAt: true,
        },
    });
}
