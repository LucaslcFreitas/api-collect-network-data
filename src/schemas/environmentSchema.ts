import { z } from 'zod';

export const environmentValueSchema = z.object({
	environment: z.string().trim().min(1).max(100),
});

export type EnvironmentValue = z.infer<typeof environmentValueSchema>;