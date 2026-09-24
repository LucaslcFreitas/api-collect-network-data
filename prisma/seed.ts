import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const morphology = [
    'Urbano denso (prédios altos)',
    'Urbano (prédios baixos)',
    'Suburbano residencial (casas, prédios baixos)',
    'Condomínio',
    'Vegetação densa',
    'Vegetação esparsa',
    "Espelho d'água",
    'Rural',
    'Campo aberto',
    'Indoor',
    'Shopping',
    'Estacionamento fechado',
    'Estádio ou campo esportivo',
    'Rodovia',
    'Estrada',
];

const topography = [
    'Subida íngrime',
    'Subida',
    'Plano',
    'Descida',
    'Descida íngrime',
];

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString,
        ssl: process.env.SSL_MODE === 'True' || process.env.SSL_MODE === 'true'
            ? { rejectUnauthorized: false }
            : undefined,
    }),
});

async function main(): Promise<void> {
    await prisma.$transaction([
        ...morphology.map(environment => prisma.morphology.upsert({
            where: { environment },
            update: {},
            create: { environment },
        })),
        ...topography.map(environment => prisma.topography.upsert({
            where: { environment },
            update: {},
            create: { environment },
        })),
    ]);
}

main()
    .then(async () => prisma.$disconnect())
    .catch(async error => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });