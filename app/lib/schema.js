import { z } from "zod";
export const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["CURRENT", "SAVINGS"]),
  balance: z.number().min(1, "Balance is required"),
  isDefault: z.boolean().default(false),
});
