"use server";

import { ProfileSchema, ProfileType } from "@/utils/zodSchemas";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const updateUserProfile = async (values: ProfileType) => {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const parsedData = ProfileSchema.safeParse(values);
  if (!parsedData.success) {
    return {
      success: false,
      error: parsedData.error.errors.map((e) => e.message).join(", "),
    };
  }

  const { firstName, lastName, avatar, email } = parsedData.data;

  try {
    await clerkClient.users.updateUser(userId, {
      firstName,
      lastName,
      publicMetadata: {
        avatar,
      },
    });

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Clerk update error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
};
