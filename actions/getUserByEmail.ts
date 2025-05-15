"use server"

import { clerkClient } from "@clerk/nextjs/server";

const client = await clerkClient();

export async function getUserByEmail(email: string) {
    try {
        const users = await client.users.getUserList({ emailAddress: [email] });

        if (users.totalCount > 0) {
            const user = users.data;
            return { userId: user.map((d) => d.id) };
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching user by email (${email}):`, error);
        return null;
    }
}
