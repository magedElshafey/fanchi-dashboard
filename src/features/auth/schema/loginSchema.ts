import { z } from "zod";
import { singlePasswordSchema } from "./passwordSchema";

export const loginSchema = z.object({
  email: z.string().min(1, "phone is required").email(),
  password: singlePasswordSchema,
  rememberMe: z.boolean().optional(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
