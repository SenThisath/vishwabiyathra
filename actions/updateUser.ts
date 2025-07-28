"use server";

import { clerkClient } from "@clerk/nextjs/server";

const client = await clerkClient();

export async function updateUserEmail({
  userId,
  role,
}: {
  userId: string;
  role: string;
}) {
  try {
    const response = await client.users.updateUser(userId, {
      publicMetadata: {
        role,
      },
    });
    return { success: true, userId: response.id };
  } catch (e) {
    console.error("Failed to update email:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
