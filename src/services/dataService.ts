import { getCollections, type CellDocument, type MeasurementDocument } from '../db/mongodb.js';

function formatCell(cell: CellDocument) {
    return {
        registered: cell.registered,
        technology: cell.technology,
        cellId: cell.cellId,
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

function formatMeasurement(measurement: MeasurementDocument) {
    return {
        timestamp: measurement.timestamp,
        receivedAt: measurement.receivedAt,
        environment: measurement.environment,
        location: measurement.location,
        motion: measurement.motion,
        servingCell: formatCell(measurement.servingCell),
        neighboringCells: measurement.neighboringCells.map(formatCell),
    };
}

export async function getParticipantData(
    participantId: string,
    page: number,
    limit: number,
) {
    const skip = (page - 1) * limit;
    const { batches } = await getCollections();

    const [batchDocuments, total] = await Promise.all([
        batches
            .find({ participantId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray(),
        batches.countDocuments({ participantId }),
    ]);

    return {
        batches: batchDocuments.map(batch => ({
            id: batch._id,
            measurementCount: batch.measurementCount,
            createdAt: batch.createdAt,
            measurements: [...batch.measurements]
                .sort((first, second) => first.timestamp.getTime() - second.timestamp.getTime())
                .map(formatMeasurement),
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
