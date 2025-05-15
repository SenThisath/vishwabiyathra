"use server";

import { Roles } from "@/types/globals";
import { clerkClient } from "@clerk/nextjs/server";

const client = await clerkClient();
export async function createUser(email: string, role?: Roles) {
    try {
        const user = await client.users.createUser({
            emailAddress: [email],
            password: "password",
            publicMetadata: { role }
        });
        return { success: true, userId: user.id };
    } catch (error) {
        console.log(error);
        return { success: false, error: error };
    }
}
