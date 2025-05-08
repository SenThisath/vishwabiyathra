"use client";

import About from "@/components/sections/About";
import Hero from "@/components/sections/Hero";
import MouseFollower from "@/components/MouseFollower";
import { motion } from "framer-motion";
import Competitions from "@/components/sections/Competitions";
import LeaderBoard from "@/components/sections/LeaderBoard";

export default function Home() {
    const particles = Array.from({ length: 30 }, () => ({
        size: Math.random() * 6 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
    }));

    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 z-0">
                {particles.map((particle, index) => (
                    <motion.div
                        key={index}
                        className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
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
            <MouseFollower />
            <Hero />
            <div className="relative z-10">
                <About />
                <Competitions />
                <LeaderBoard />
            </div>
        </div>
    );
}
