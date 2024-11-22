import z from "zod";
export const sendTransactionSchema = z.object({
  to: z
    .string()
    .startsWith("0x")
    .length(42)
    .regex(/^0x[a-fA-F0-9]{40}$/),
  value: z.string().startsWith("0x"),
});

export type SendTransactionDto = z.infer<typeof sendTransactionSchema>;

export const sendTransactionResultSchema = z
  .string()
  .startsWith("0x")
  .length(66)
  .regex(/^0x[a-fA-F0-9]{64}$/);

export type SendTransactionResultDto = z.infer<
  typeof sendTransactionResultSchema
>;
