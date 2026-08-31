import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import routes from './routes/index.js';

const app = express();

app.use(helmet());
app.use(cors());

app.use(
    express.json({
        limit: '1mb',
    }),
);

const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
});

app.use(globalRateLimiter);

app.use('/api/v1', routes);

// 404
app.use((_req, res) => {
    res.status(404).json({
        error: 'Not Found',
    });
});

export default app;
