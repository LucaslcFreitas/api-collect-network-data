import { z } from 'zod';

export const updateParticipantSchema = z
    .object({
        appVersion: z.string().min(1).max(50).optional(),

        deviceModel: z.string().min(1).max(100).optional(),

        os: z.string().min(1).max(50).optional(),
    })
    .strict();

export type UpdateParticipantInput = z.infer<typeof updateParticipantSchema>;
