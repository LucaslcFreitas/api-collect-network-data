import { prisma } from '../db/prisma.js';
import type { BatchInput } from '../schemas/batchSchema.js';

function toDate(timestamp: number): Date {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        throw new Error('Invalid timestamp');
    }

    return date;
}

function convertCellId(cellId: number | null | undefined): bigint | undefined {
    if (cellId === null || cellId === undefined) {
        return undefined;
    }

    return BigInt(cellId);
}

export async function createBatch(
    participantId: string,
    input: BatchInput,
): Promise<{
    batchId: string;
    measurementCount: number;
}> {
    const result = await prisma.$transaction(async transaction => {
        const batch = await transaction.batch.create({
            data: {
                participantId,
                clientBatchId: input.clientBatchId,
                measurementCount: input.measurements.length,
                schemaVersion: 1,
            },
            select: {
                id: true,
            },
        });

        for (const measurement of input.measurements) {
            const createdMeasurement = await transaction.measurement.create({
                data: {
                    batchId: batch.id,
                    measuredAt: toDate(measurement.timestamp),

                    environment: measurement.environment,
                    location: {
                        create: {
                            latitude: measurement.location.latitude,
                            longitude: measurement.location.longitude,
                            altitude: measurement.location.altitude,
                            accuracy: measurement.location.accuracy,
                            altitudeAccuracy: measurement.location.altitudeAccuracy,
                            speed: measurement.location.speed,
                            heading: measurement.location.heading,
                        },
                    },
                },
                select: {
                    id: true,
                },
            });

            await transaction.motion.create({
                data: {
                    measurementId: createdMeasurement.id,

                    accelerometerX: measurement.motion.accelerometer.x,
                    accelerometerY: measurement.motion.accelerometer.y,
                    accelerometerZ: measurement.motion.accelerometer.z,

                    gyroscopeX: measurement.motion.gyroscope.x,
                    gyroscopeY: measurement.motion.gyroscope.y,
                    gyroscopeZ: measurement.motion.gyroscope.z,
                },
            });

            const cell = measurement.servingCell;

            await transaction.servingCell.create({
                data: {
                    measurementId: createdMeasurement.id,

                    registered: cell.registered,
                    technology: cell.technology,

                    cellId: convertCellId(cell.cellId),
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
                },
            });

            if (measurement.neighboringCells.length > 0) {
                await transaction.neighboringCell.createMany({
                    data: measurement.neighboringCells.map(neighbor => ({
                        measurementId: createdMeasurement.id,

                        registered: neighbor.registered,
                        technology: neighbor.technology,

                        cellId: convertCellId(neighbor.cellId),
                        pci: neighbor.pci,
                        tac: neighbor.tac,
                        arfcn: neighbor.arfcn,

                        mcc: neighbor.mcc,
                        mnc: neighbor.mnc,

                        rsrp: neighbor.rsrp,
                        rsrq: neighbor.rsrq,
                        rssi: neighbor.rssi,
                        sinr: neighbor.sinr,
                        timingAdvance: neighbor.timingAdvance,
                    })),
                });
            }
        }

        await transaction.participant.update({
            where: {
                id: participantId,
            },
            data: {
                lastSeenAt: new Date(),
            },
        });

        return batch;
    });

    return {
        batchId: result.id,
        measurementCount: input.measurements.length,
    };
}
