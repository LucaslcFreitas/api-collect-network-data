import { randomUUID } from 'node:crypto';
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

        const measurements = input.measurements.map(measurement => {
            const cell = measurement.servingCell;

            return {
                id: randomUUID(),
                batchId: batch.id,
                measuredAt: toDate(measurement.timestamp),
                morphology: measurement.morphology,
                topography: measurement.topography,
                latitude: measurement.location.latitude,
                longitude: measurement.location.longitude,
                altitude: measurement.location.altitude,
                accuracy: measurement.location.accuracy,
                altitudeAccuracy: measurement.location.altitudeAccuracy,
                speed: measurement.location.speed,
                heading: measurement.location.heading,
                accelerometerX: measurement.motion.accelerometer.x,
                accelerometerY: measurement.motion.accelerometer.y,
                accelerometerZ: measurement.motion.accelerometer.z,
                gyroscopeX: measurement.motion.gyroscope.x,
                gyroscopeY: measurement.motion.gyroscope.y,
                gyroscopeZ: measurement.motion.gyroscope.z,
                servingRegistered: cell.registered,
                servingTechnology: cell.technology,
                servingCellId: convertCellId(cell.cellId),
                servingPci: cell.pci,
                servingTac: cell.tac,
                servingArfcn: cell.arfcn,
                servingMcc: cell.mcc,
                servingMnc: cell.mnc,
                servingRsrp: cell.rsrp,
                servingRsrq: cell.rsrq,
                servingRssi: cell.rssi,
                servingSinr: cell.sinr,
                servingTimingAdvance: cell.timingAdvance,
            };
        });

        await transaction.measurement.createMany({ data: measurements });

        const neighboringCells = input.measurements.flatMap((measurement, index) =>
            measurement.neighboringCells.map(neighbor => ({
                measurementId: measurements[index].id,
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
        );

        if (neighboringCells.length > 0) {
            await transaction.neighboringCell.createMany({
                data: neighboringCells,
            });
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
    }, {
        timeout: 150_000,
    });

    return {
        batchId: result.id,
        measurementCount: input.measurements.length,
    };
}
