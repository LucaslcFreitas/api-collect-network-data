import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './db/prisma.js';

const server = app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
});

async function shutdown(signal: string): Promise<void> {
    console.log(`\nReceived ${signal}. Shutting down...`);

    server.close(async () => {
        console.log('HTTP server closed.');

        await prisma.$disconnect();

        console.log('Database connection closed.');

        process.exit(0);
    });
}

process.on('SIGINT', () => {
    void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
});
