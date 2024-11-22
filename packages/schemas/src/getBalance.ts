import { z } from 'zod';

export const getBalanceSchema = z.object({});
export const getBalanceResultSchema = z.string().startsWith('0x');


export type GetBalanceParamsDto = z.infer<typeof getBalanceSchema>;
export type GetBalanceResultDto = z.infer<typeof getBalanceResultSchema>;
