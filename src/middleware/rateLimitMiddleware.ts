import rateLimit from 'express-rate-limit';

export const participantRegistrationRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000,

    limit: 10,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'RATE_LIMIT_EXCEEDED',
        message:
            'Too many participant registration requests. Please try again later.',
    },
});

export const batchUploadRateLimit = rateLimit({
    windowMs: 60 * 1000,

    limit: 120,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many upload requests. Please try again later.',
    },
});
