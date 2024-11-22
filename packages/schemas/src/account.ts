import { z } from 'zod';
// params: z.object({}),
// result: z.object({
//   address: z.string(),
//   name: z.string(),
// }),

export const accountParamsSchema = z.object({});

export type AccountParams = z.infer<typeof accountParamsSchema>;

export const accountResultSchema = z.object({
  address: z.string(),
  name: z.string(),
});

export type AccountResult = z.infer<typeof accountResultSchema>;

