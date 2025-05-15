"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

export async function getToken() {
  const streamApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
  const streamApiSecret = process.env.STREAM_VIDEO_SECRET_KEY;
  if (!streamApiKey || !streamApiSecret) {
    throw new Error("Stream Api or Stream Secret not defined yet.");
  }
  const user = await currentUser();
  console.log(`Token for user ${user?.id}`);
  if (!user) {
    return new Error("User not authenticated.");
  }
  const streamClient = new StreamClient(streamApiKey, streamApiSecret);
  const expirationTime = Math.floor(Date.now() / 1000) * 60 * 60;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;
  const token = streamClient.createToken(user.id, expirationTime, issuedAt);
  console.log(`Success: ${token}`);
  return token;
}
