"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { nanoid } from "nanoid";
import { getToken } from "@/actions/getToken";
import { motion } from "framer-motion";

function useInitializeVideoClient() {
  const { user, isLoaded: userLoaded } = useUser();
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>();
  useEffect(() => {
    if (!userLoaded) return;
    let streamUser: User;
    if (user?.id) {
      streamUser = {
        id: user.id,
        name: user.username || user.id,
        image: user.imageUrl,
      };
    } else {
      const id = nanoid();
      streamUser = {
        id,
        type: "guest",
        name: `Guest ${id}`,
      };
    }
    const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
    if (!apiKey) {
      throw new Error("apiKey not defined");
    }
    // Create a wrapper for getToken that ensures it returns Promise<string>
    const tokenProviderWrapper = user?.id
      ? async () => {
          const result = await getToken();
          if (result instanceof Error) {
            throw result; // Throw the error instead of returning it
          }
          return result; // Now this only returns string
        }
      : undefined;

    const client = new StreamVideoClient({
      apiKey,
      user: streamUser,
      tokenProvider: tokenProviderWrapper,
    });
    setVideoClient(client);
    return () => {
      client.disconnectUser();
      setVideoClient(null);
    };
  }, [user?.id, user?.imageUrl, user?.username, userLoaded]);
  return videoClient;
}

const ClientProvider = ({ children }: { children: ReactNode }) => {
  const videoClient = useInitializeVideoClient();
  if (!videoClient)
    return (
      <div className="flex items-center justify-center h-screen w-full bg-black">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-5 h-5 bg-white rounded-full"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    );
  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default ClientProvider;
