import { randomUUID } from 'node:crypto';
import { getCollections, type BatchDocument, type CellDocument } from '../db/mongodb.js';
import type { BatchInput } from '../schemas/batchSchema.js';

function toDate(timestamp: number): Date {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        throw new Error('Invalid timestamp');
    }

    return date;
}

function toCellDocument(cell: BatchInput['measurements'][number]['servingCell']): CellDocument {
    return {
        registered: cell.registered,
        technology: cell.technology,
        cellId: cell.cellId == null ? null : String(cell.cellId),
        pci: cell.pci ?? null,
        tac: cell.tac ?? null,
        arfcn: cell.arfcn ?? null,
        mcc: cell.mcc ?? null,
        mnc: cell.mnc ?? null,
        rsrp: cell.rsrp ?? null,
        rsrq: cell.rsrq ?? null,
        rssi: cell.rssi ?? null,
        sinr: cell.sinr ?? null,
        timingAdvance: cell.timingAdvance ?? null,
    };
}

export async function createBatch(
    participantId: string,
    input: BatchInput,
): Promise<{
    batchId: string;
    measurementCount: number;
}> {
    const now = new Date();
    const batch: BatchDocument = {
        _id: randomUUID(),
        participantId,
        clientBatchId: input.clientBatchId,
        createdAt: now,
        measurementCount: input.measurements.length,
        schemaVersion: 1,
        measurements: input.measurements.map(measurement => ({
            id: randomUUID(),
            timestamp: toDate(measurement.timestamp),
            receivedAt: now,
            environment: measurement.environment ?? null,
            location: {
                latitude: measurement.location.latitude,
                longitude: measurement.location.longitude,
                altitude: measurement.location.altitude ?? null,
                accuracy: measurement.location.accuracy ?? null,
                altitudeAccuracy: measurement.location.altitudeAccuracy ?? null,
                speed: measurement.location.speed ?? null,
                heading: measurement.location.heading ?? null,
            },
            motion: measurement.motion,
            servingCell: toCellDocument(measurement.servingCell),
            neighboringCells: measurement.neighboringCells.map(toCellDocument),
        })),
    };

    const { batches, participants } = await getCollections();
    try {
        await batches.insertOne(batch);
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 11000) {
            throw new Error('Unique constraint violation');
        }

        throw error;
    }

    await participants.updateOne(
        { _id: participantId },
        { $set: { lastSeenAt: now } },
    );

    return {
        batchId: batch._id,
        measurementCount: batch.measurementCount,
    };
}
