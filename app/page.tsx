"use client";

import About from "@/components/sections/About";
import Hero from "@/components/sections/Hero";
import MouseFollower from "@/components/MouseFollower";
import { motion } from "framer-motion";
import Competitions from "@/components/sections/Competitions";
import Footer from "@/components/sections/Footer";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Sponsors from "@/components/sections/Sponsors";
import LeaderBoard from "@/components/sections/LeaderBoard";
import Voting from "@/components/sections/Voting";

export default function Home() {
  const { user } = useUser();
  const insertStudent = useMutation(api.users.saveUser);
  const getUser = useQuery(
    api.users.getUserDetails,
    user ? { userId: user.id } : "skip",
  );

  useEffect(() => {
    if (!getUser) {
      if (user) {
        insertStudent({
          email: user.emailAddresses[0].emailAddress,
          name: user.username || user.fullName || user.lastName || "",
          grade: 0,
          userId: user.id,
          role: "competitor",
        });
      }
    }
  }, [user, insertStudent]);

  const [particles, setParticles] = useState<
    {
      top: string;
      left: string;
      width: number;
      height: number;
      delay: number;
      duration: number;
    }[]
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: Math.random() * 10,
      height: Math.random() * 10,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }));
    setParticles(newParticles);
  }, []);
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"
            style={{
              width: particle.width,
              height: particle.height,
              left: `${particle.left}`,
              top: `${particle.top}`,
            }}
            animate={{
              y: [0, -150, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <Header />
      <MouseFollower />
      <Hero />
      <About />
      <Competitions />
      <Voting />
      <LeaderBoard />
      <Sponsors />
      <Footer />
    </div>
  );
}
