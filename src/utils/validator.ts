import { ZodSchema } from "zod";

export function validateBody<T>(schema: ZodSchema<T>, body: unknown) {
  return schema.safeParse(body);
}