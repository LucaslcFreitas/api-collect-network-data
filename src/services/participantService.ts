import { randomUUID } from 'node:crypto';
import { getCollections } from '../db/mongodb.js';
import {
    generateParticipantToken,
    hashParticipantToken,
} from '../utils/token.js';
import type { UpdateParticipantInput } from '../schemas/participantSchema.js';

export interface CreateParticipantResult {
    participantId: string;
    token: string;
}

export async function createParticipant(
    data: UpdateParticipantInput = {},
): Promise<CreateParticipantResult> {
    const token = generateParticipantToken();
    const tokenHash = hashParticipantToken(token);

    const { participants } = await getCollections();
    const participantId = randomUUID();

    await participants.insertOne({
        _id: participantId,
        tokenHash,
        ...data,
        createdAt: new Date(),
        status: 'ACTIVE',
    });

    return {
        participantId,
        token,
    };
}

export async function getParticipant(participantId: string) {
    const { participants } = await getCollections();

    const participant = await participants.findOne(
        { _id: participantId },
        {
            projection: {
                _id: 1,
                appVersion: 1,
                deviceModel: 1,
                os: 1,
                status: 1,
                createdAt: 1,
                lastSeenAt: 1,
            },
        },
    );

    return participant && {
        id: participant._id,
        appVersion: participant.appVersion ?? null,
        deviceModel: participant.deviceModel ?? null,
        os: participant.os ?? null,
        status: participant.status,
        createdAt: participant.createdAt,
        lastSeenAt: participant.lastSeenAt ?? null,
    };
}

export async function updateParticipant(
    participantId: string,
    data: UpdateParticipantInput,
) {
    const { participants } = await getCollections();

    await participants.updateOne(
        { _id: participantId },
        { $set: data },
    );

    return getParticipant(participantId);
}

export async function revokeParticipant(participantId: string) {
    const { participants } = await getCollections();
    const revokedAt = new Date();

    await participants.updateOne(
        { _id: participantId },
        { $set: { status: 'REVOKED', revokedAt } },
    );

    return {
        id: participantId,
        status: 'REVOKED' as const,
        revokedAt,
    };
}

export async function deleteParticipant(participantId: string) {
    const { participants, batches } = await getCollections();

    await Promise.all([
        participants.deleteOne({ _id: participantId }),
        batches.deleteMany({ participantId }),
    ]);

    return { id: participantId };
}
