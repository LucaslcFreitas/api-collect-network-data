import { z } from 'zod';

export const MAX_MEASUREMENTS_PER_BATCH = 50_000;

const locationSchema = z.object({
    latitude: z.number().finite().min(-90).max(90).nullable(),
    longitude: z.number().finite().min(-180).max(180).nullable(),
    altitude: z.number().finite().nullable().optional(),
    accuracy: z.number().finite().nonnegative().nullable().optional(),
    altitudeAccuracy: z.number().finite().nonnegative().nullable().optional(),
    speed: z.number().finite().nonnegative().nullable().optional(),
    heading: z.number().finite().nullable().optional(),
});

const accelerometerSchema = z.object({
    x: z.number().finite().nullable().optional(),
    y: z.number().finite().nullable().optional(),
    z: z.number().finite().nullable().optional(),
});

const gyroscopeSchema = z.object({
    x: z.number().finite().nullable().optional(),
    y: z.number().finite().nullable().optional(),
    z: z.number().finite().nullable().optional(),
});

const motionSchema = z.object({
    accelerometer: accelerometerSchema,
    gyroscope: gyroscopeSchema,
});

const cellSchema = z.object({
    registered: z.boolean().nullable(),
    technology: z.string().min(0).max(30).nullable(),

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
    morphology: z.string().max(100).nullable().optional(),
    topography: z.string().max(100).nullable().optional(),
    location: locationSchema,
    motion: motionSchema,
    servingCell: cellSchema,
    neighboringCells: z.array(cellSchema).max(50),
});

export const batchSchema = z.object({
    clientBatchId: z
        .string()
        .min(10)
        .max(64)
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            'clientBatchId contains invalid characters.',
        ),

    measurements: z
        .array(measurementSchema)
        .min(1)
        .max(MAX_MEASUREMENTS_PER_BATCH),
});

export type BatchInput = z.infer<typeof batchSchema>;
export type MeasurementInput = z.infer<typeof measurementSchema>;
