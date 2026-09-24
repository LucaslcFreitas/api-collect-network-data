import app from './app.js';
import { env } from './config/env.js';
import { disconnectDatabase } from './db/mongodb.js';

import { initializeDatabase } from './db/mongodb.js';

let server: ReturnType<typeof app.listen>;

async function startServer(): Promise<void> {
    await initializeDatabase();

    server = app.listen(env.port, () => {
        console.log(`API running on http://localhost:${env.port}`);
    });
}

async function shutdown(signal: string): Promise<void> {
    console.log(`\nReceived ${signal}. Shutting down...`);

    server.close(async () => {
        console.log('HTTP server closed.');

        await disconnectDatabase();

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

void startServer().catch(error => {
    console.error('Unable to start API:', error);
    process.exit(1);
});
