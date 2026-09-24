import {
    defaultEnvironment,
    getCollections,
    type EnvironmentDocument,
} from '../db/mongodb.js';

const environmentId = 'default';

export async function getEnvironment(): Promise<Omit<EnvironmentDocument, '_id'>> {
    const { environment } = await getCollections();
    const document = await environment.findOne({ _id: environmentId });

    return {
        morphology: document?.morphology ?? defaultEnvironment.morphology,
        topography: document?.topography ?? defaultEnvironment.topography,
    };
}

export async function addMorphology(value: string): Promise<void> {
    const { environment } = await getCollections();

    await environment.updateOne(
        { _id: environmentId },
        { $addToSet: { morphology: value } },
        { upsert: true },
    );
}

export async function addTopography(value: string): Promise<void> {
    const { environment } = await getCollections();

    await environment.updateOne(
        { _id: environmentId },
        { $addToSet: { topography: value } },
        { upsert: true },
    );
}