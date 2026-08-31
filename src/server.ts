import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
});

function shutdown(signal: string): void {
    console.log(`\nReceived ${signal}. Shutting down...`);

    server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });
}

process.on('SIGINT', () => {
    shutdown('SIGINT');
});

process.on('SIGTERM', () => {
    shutdown('SIGTERM');
});
