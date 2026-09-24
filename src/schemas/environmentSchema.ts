import { z } from 'zod';

export const environmentSchema = z
    .object({
        environment: z.string().trim().min(1).max(100),
    })
    .strict();

export type EnvironmentInput = z.infer<typeof environmentSchema>;