import { prisma } from '../db/prisma.js';
import type { EnvironmentInput } from '../schemas/environmentSchema.js';

export async function getEnvironments() {
    const [morphology, topography] = await prisma.$transaction([
        prisma.morphology.findMany({ orderBy: { createdAt: 'asc' }, select: { environment: true } }),
        prisma.topography.findMany({ orderBy: { createdAt: 'asc' }, select: { environment: true } }),
    ]);

    return {
        morphology: morphology.map(item => item.environment),
        topography: topography.map(item => item.environment),
    };
}

export async function addMorphology(data: EnvironmentInput) {
    await prisma.morphology.create({ data });
    return getEnvironments();
}

export async function addTopography(data: EnvironmentInput) {
    await prisma.topography.create({ data });
    return getEnvironments();
}