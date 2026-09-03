import { prisma } from '../db/prisma.js';

export async function getParticipantData(
    participantId: string,
    page: number,
    limit: number,
) {
    const skip = (page - 1) * limit;

    const [batches, total] = await prisma.$transaction([
        prisma.batch.findMany({
            where: {
                participantId,
            },

            orderBy: {
                createdAt: 'desc',
            },

            skip,
            take: limit,

            select: {
                id: true,
                clientBatchId: true,
                measurementCount: true,
                schemaVersion: true,
                createdAt: true,
            },
        }),

        prisma.batch.count({
            where: {
                participantId,
            },
        }),
    ]);

    return {
        batches,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
