import { z } from 'zod';

const locationSchema = z.object({
    latitude: z.number().finite().min(-90).max(90),
    longitude: z.number().finite().min(-180).max(180),
    altitude: z.number().finite().nullable().optional(),
    accuracy: z.number().finite().nonnegative().nullable().optional(),
    altitudeAccuracy: z.number().finite().nonnegative().nullable().optional(),
    speed: z.number().finite().nonnegative().nullable().optional(),
    heading: z.number().finite().nullable().optional(),
});

const accelerometerSchema = z.object({
    x: z.number().finite(),
    y: z.number().finite(),
    z: z.number().finite(),
});

const gyroscopeSchema = z.object({
    x: z.number().finite(),
    y: z.number().finite(),
    z: z.number().finite(),
});

const motionSchema = z.object({
    accelerometer: accelerometerSchema,
    gyroscope: gyroscopeSchema,
});

const cellSchema = z.object({
    registered: z.boolean(),
    technology: z.string().min(1).max(20),

    cellId: z.number().int().nonnegative().nullable().optional(),
    pci: z.number().int().nonnegative().nullable().optional(),
    tac: z.number().int().nonnegative().nullable().optional(),
    arfcn: z.number().int().nonnegative().nullable().optional(),

    mcc: z.string().max(10).nullable().optional(),
    mnc: z.string().max(10).nullable().optional(),

    rsrp: z.number().finite().nullable().optional(),
    rsrq: z.number().finite().nullable().optional(),
    rssi: z.number().finite().nullable().optional(),
    sinr: z.number().finite().nullable().optional(),
    timingAdvance: z.number().finite().nullable().optional(),
});

export const measurementSchema = z.object({
    timestamp: z.number().int().positive(),
    environment: z.string().max(100).nullable().optional(),
    location: locationSchema,
    motion: motionSchema,
    servingCell: cellSchema,
    neighboringCells: z.array(cellSchema).max(32),
});

export const batchSchema = z.object({
    clientBatchId: z
        .string()
        .min(16)
        .max(64)
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            'clientBatchId contains invalid characters.',
        ),

    measurements: z.array(measurementSchema).min(1).max(500),
});

export type BatchInput = z.infer<typeof batchSchema>;
export type MeasurementInput = z.infer<typeof measurementSchema>;
