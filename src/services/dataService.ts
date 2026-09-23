import { prisma } from '../db/prisma.js';

function formatCell<T extends {
    registered: boolean | null;
    technology: string | null;
    cellId: bigint | null;
    pci: number | null;
    tac: number | null;
    arfcn: number | null;
    mcc: string | null;
    mnc: string | null;
    rsrp: number | null;
    rsrq: number | null;
    rssi: number | null;
    sinr: number | null;
    timingAdvance: number | null;
}>(cell: T) {
    return {
        registered: cell.registered,
        technology: cell.technology,
        cellId: cell.cellId?.toString() ?? null,
        pci: cell.pci,
        tac: cell.tac,
        arfcn: cell.arfcn,
        mcc: cell.mcc,
        mnc: cell.mnc,
        rsrp: cell.rsrp,
        rsrq: cell.rsrq,
        rssi: cell.rssi,
        sinr: cell.sinr,
        timingAdvance: cell.timingAdvance,
    };
}

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
                        measuredAt: true,
                        receivedAt: true,
                        environment: true,
                        location: {
                            select: {
                                latitude: true,
                                longitude: true,
                                altitude: true,
                                accuracy: true,
                                altitudeAccuracy: true,
                                speed: true,
                                heading: true,
                            },
                        },
                        motion: {
                            select: {
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
                                timingAdvance: true,
                            }
                        },
                        neighboringCells: {
                            select: {
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
                                timingAdvance: true,
                            },
                        },
                    }
                }
            },
        }),

        prisma.batch.count({
            where: {
                participantId,
            },
        }),
    ], {
        timeout: 120_000,
    });

    return {
        batches: batches.map(batch => ({
            id: batch.id,
            measurementCount: batch.measurementCount,
            createdAt: batch.createdAt,
            measurements: batch.measurements.map(measurement => ({
                timestamp: measurement.measuredAt,
                receivedAt: measurement.receivedAt,
                environment: measurement.environment,
                location: measurement.location,
                motion: measurement.motion
                    ? {
                        accelerometer: {
                            x: measurement.motion.accelerometerX,
                            y: measurement.motion.accelerometerY,
                            z: measurement.motion.accelerometerZ,
                        },
                        gyroscope: {
                            x: measurement.motion.gyroscopeX,
                            y: measurement.motion.gyroscopeY,
                            z: measurement.motion.gyroscopeZ,
                        },
                    }
                    : null,
                servingCell: measurement.servingCell
                    ? formatCell(measurement.servingCell)
                    : null,
                neighboringCells: measurement.neighboringCells.map(formatCell),
            })),
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
