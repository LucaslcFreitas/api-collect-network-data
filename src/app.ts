import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import routes from './routes/index.js';

const app = express();

app.use(helmet());
app.use(cors());

app.use(
    express.json({
        limit: '10mb',
    }),
);


app.use('/api/v1', routes);

// 404
app.use((_req, res) => {
    res.status(404).json({
        error: 'Not Found',
    });
});

export default app;
