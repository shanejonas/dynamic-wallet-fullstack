import z from "zod";
export const signMessageSchema = z.object({
  message: z.string().min(1),
});

export type SignMessageDto = z.infer<typeof signMessageSchema>;

export const signMessageResultSchema = z
  .string()
  .startsWith("0x")
  .length(132)
  .regex(/^0x[a-fA-F0-9]{130}$/);

export type SignMessageResultDto = z.infer<typeof signMessageResultSchema>;
