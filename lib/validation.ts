import { z } from 'zod';

export const PostSchema = z.object({
  accounts: z.array(z.string()).min(1),
  text: z.string().optional(),
  attachment: z.array(z.string()).optional().default([]),
  datetime: z.coerce.date(),
});

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function isNumeric(str: string): boolean {
  return !isNaN(Number(str));
}
