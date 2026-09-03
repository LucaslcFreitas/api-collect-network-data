import { z } from 'zod';

export const dataQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type DataQueryInput = z.infer<typeof dataQuerySchema>;
