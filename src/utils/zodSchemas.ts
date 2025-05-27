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

export const ProfileSchema = z.object({
  firstName: z.coerce
    .string()
    .min(2, "You need to enter at least 2 Characters")
    .max(40, "you need to enter at most 40 characters"),
  lastName: z.coerce
    .string()
    .min(2, "You need to enter at least 2 Characters")
    .max(40, "you need to enter at most 40 characters"),
  email: z.string().email(),
  avatar: z.any().optional(),
});

export type ProfileType = z.infer<typeof ProfileSchema>;
