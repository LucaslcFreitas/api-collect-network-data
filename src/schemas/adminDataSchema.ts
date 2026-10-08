import { z } from 'zod';

export const participantIdSchema = z.object({
    participantId: z.string().uuid(),
});

export const batchIdSchema = z.object({
    batchId: z.string().uuid(),
});