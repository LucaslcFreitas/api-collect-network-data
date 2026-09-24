import 'dotenv/config';

import { Collection, Db, MongoClient } from 'mongodb';

const configuredConnectionString = process.env.DATABASE_URL;

if (!configuredConnectionString) {
    throw new Error('DATABASE_URL is not defined');
}

const connectionString: string = configuredConnectionString;

export interface ParticipantDocument {
    _id: string;
    tokenHash: string;
    appVersion?: string | null;
    deviceModel?: string | null;
    os?: string | null;
    createdAt: Date;
    lastSeenAt?: Date | null;
    revokedAt?: Date | null;
    status: 'ACTIVE' | 'REVOKED';
}

export interface CellDocument {
    registered: boolean | null;
    technology: string | null;
    cellId: string | null;
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
}

export interface MeasurementDocument {
    id: string;
    timestamp: Date;
    receivedAt: Date;
    environment: string | null;
    location: {
        latitude: number;
        longitude: number;
        altitude: number | null;
        accuracy: number | null;
        altitudeAccuracy: number | null;
        speed: number | null;
        heading: number | null;
    };
    motion: {
        accelerometer: { x: number; y: number; z: number };
        gyroscope: { x: number; y: number; z: number };
    };
    servingCell: CellDocument;
    neighboringCells: CellDocument[];
}

export interface BatchDocument {
    _id: string;
    participantId: string;
    clientBatchId: string;
    createdAt: Date;
    measurementCount: number;
    schemaVersion: number;
    measurements: MeasurementDocument[];
}

let client: MongoClient | undefined;
let databasePromise: Promise<Db> | undefined;

async function getDatabase(): Promise<Db> {
    if (!databasePromise) {
        client = new MongoClient(connectionString);
        databasePromise = client.connect().then(async connectedClient => {
            const database = connectedClient.db('mobile_data');

            await Promise.all([
                database.collection<ParticipantDocument>('participants').createIndex(
                    { tokenHash: 1 },
                    { unique: true },
                ),
                database.collection<BatchDocument>('batches').createIndex(
                    { participantId: 1, clientBatchId: 1 },
                    { unique: true },
                ),
                database.collection<BatchDocument>('batches').createIndex({
                    participantId: 1,
                    createdAt: -1,
                }),
            ]);

            return database;
        });
    }

    return databasePromise;
}

export async function getCollections(): Promise<{
    participants: Collection<ParticipantDocument>;
    batches: Collection<BatchDocument>;
}> {
    const database = await getDatabase();

    return {
        participants: database.collection<ParticipantDocument>('participants'),
        batches: database.collection<BatchDocument>('batches'),
    };
}

export async function checkDatabase(): Promise<void> {
    const database = await getDatabase();
    await database.command({ ping: 1 });
}

export async function disconnectDatabase(): Promise<void> {
    if (client) {
        await client.close();
        client = undefined;
        databasePromise = undefined;
    }
}