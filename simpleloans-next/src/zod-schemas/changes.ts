import { z } from "zod";

// Define the Change schema
const ChangeSchema = z.object({
  field: z.string(),
  oldValue: z.string().nullable(),
  newValue: z.string().nullable(),
});

// Define the Changes array schema
export const ChangesSchema = z.array(ChangeSchema);

// Use this type in the database call and schema validation
export type Change = z.infer<typeof ChangeSchema>;
