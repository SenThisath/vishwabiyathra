// File path: app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    // Get the env variable
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error("Missing CLERK_WEBHOOK_SECRET env variable");
        return new Response("Server configuration error", {
            status: 500,
        });
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error("Missing svix headers");
        return new Response("Missing svix headers", {
            status: 400,
        });
    }

    // Get the body
    let payload;
    try {
        payload = await req.json();
    } catch (err) {
        console.error("Error parsing request body:", err);
        return new Response("Error parsing request body", {
            status: 400,
        });
    }

    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    // Verify the payload with the headers
    let evt: WebhookEvent;
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook signature:", err);
        return new Response("Error verifying webhook signature", {
            status: 401,
        });
    }

    console.log("Webhook verified successfully, event type:", evt.type);

    // Process the webhook event
    try {
        if (evt.type === "user.created") {
            const { id, email_addresses } = evt.data;
            if (!id || !email_addresses) {
                console.error("Missing user ID or email in webhook payload");
                return new Response("Missing user ID or email in payload", {
                    status: 400,
                });
            }

            console.log(`Processing user.created webhook for user: ${id}`);

            const clerk = await clerkClient();

            // Set role dynamically based on some condition
            let role: "admin" | "competitor" | "teacher" = "competitor"; // default role

            // Example condition: set role based on the email or some other logic
            if (email_addresses[0]?.email_address?.endsWith("@admin.com")) {
                role = "admin";
            } else if (
                email_addresses[0]?.email_address?.endsWith("@teacher.com")
            ) {
                role = "teacher";
            } else {
                role = "competitor";
            }

            // Update user metadata
            try {
                await clerk.users.updateUserMetadata(id, {
                    publicMetadata: {
                        role: role,
                    },
                });
                console.log(`✅ Role set to ${role} for user: ${id}`);
            } catch (updateError) {
                console.error(
                    `Failed to update user metadata: ${id}`,
                    updateError
                );
                return new Response("Failed to update user metadata", {
                    status: 500,
                });
            }
        } else {
            console.log(
                `Received webhook of type: ${evt.type} - no action needed`
            );
        }
    } catch (err) {
        console.error("Error processing webhook:", err);
        return new Response("Error processing webhook", { status: 500 });
    }

    return new Response("Webhook processed successfully", { status: 200 });
}
