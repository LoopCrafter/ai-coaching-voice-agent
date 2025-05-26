import { z } from "zod";

export const CoachSchema = z.object({
  topic: z
    .string()
    .min(5, "It must be more than 5 characters")
    .max(120, "it must be less than 120 characters"),
  expert: z.enum(["Joanna", "Salli", "Joey"], {
    required_error: "Please select an expert",
  }),
});

export type CoachSchemaType = z.infer<typeof CoachSchema>;
