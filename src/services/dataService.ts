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
                measurements: {
                    orderBy: {
                        measuredAt: 'asc',
                    },
                    select: {
                        id: true,
                        batchId: true,
                        measuredAt: true,
                        receivedAt: true,
                        latitude: true,
                        longitude: true,
                        altitude: true,
                        accuracy: true,
                        altitudeAccuracy: true,
                        speed: true,
                        heading: true,
                        motion: {
                            select: {
                                id: true,
                                measurementId: true,
                                accelerometerX: true,
                                accelerometerY: true,
                                accelerometerZ: true,
                                gyroscopeX: true,
                                gyroscopeY: true,
                                gyroscopeZ: true,
                            }
                        },
                        servingCell: {
                            select: {
                                id: true,
                                measurementId: true,
                                registered: true,
                                technology: true,
                                cellId: true,
                                pci: true,
                                tac: true,
                                arfcn: true,
                                mcc: true,
                                mnc: true,
                                rsrp: true,
                                rsrq: true,
                                rssi: true,
                                sinr: true,
                            }
                        },
                        neighboringCells: true,
                    }
                }
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
