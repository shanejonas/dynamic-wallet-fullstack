import z from "zod";
export const createWalletSchema = z.object({
  name: z.string().min(1),
});

export type CreateWalletDto = z.infer<typeof createWalletSchema>;

export const createWalletResultSchema = z.object({
  name: z.string(),
  address: z
    .string()
    .startsWith("0x")
    .length(42)
    .regex(/^0x[a-fA-F0-9]{40}$/),
});

export type CreateWalletResultDto = z.infer<typeof createWalletResultSchema>;
