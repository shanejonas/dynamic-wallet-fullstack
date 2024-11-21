import z from 'zod';

export const userSchema = z.object({
  name: z.string(),
  age: z.number().optional(),
});

export type UserDto = z.infer<typeof userSchema>;
