"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { FadeInWhenVisible } from "../FadeInWhenVisible";
import { useRef } from "react";

export default function Hero() {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    return (
        <div className="min-h-screen flex flex-col bg-black">
            {/* Hero section */}
            <main className="overflow-x-hidden" ref={containerRef}>
                <motion.section
                    style={{ y, opacity }}
                    className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-10"
                >
                    <div className="text-center w-full max-w-4xl mx-auto">
                        <FadeInWhenVisible direction="down" delay={0.1}>
                            <div className="flex items-center justify-center mb-4">
                                <div className="relative w-full h-[150px] sm:h-[150px] md:h-[200px] max-w-[350px] sm:max-w-[400px] md:max-w-[500px]">
                                    <Image
                                        src="/logo.png"
                                        alt="Logo"
                                        className="object-contain"
                                        fill
                                        sizes="(max-width: 640px) 350px, (max-width: 768px) 400px, 500px"
                                        priority
                                    />

                                    {/* Glow effect behind logo */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full filter blur-3xl opacity-30 z-10"
                                        animate={{
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />
                                </div>
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible direction="up" delay={0.1}>
                            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl mb-8 max-w-3xl mx-auto font-extrabold uppercase bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent">
                                A Paradise Where Legends Are Born
                            </h1>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible direction="up" delay={0.4}>
                            <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-blue-100 px-4">
                                <span className="relative">
                                    <motion.span
                                        className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur opacity-0"
                                        animate={{ opacity: [0, 0.5, 0] }}
                                        transition={{
                                            duration: 3,
                                            delay: 1,
                                            repeat: Infinity,
                                        }}
                                    />
                                    <span className="relative">
                                        VISHWABHIYATHRA&apos;25 is organized
                                        proudly by The Science Society of
                                        Bandaranayake College, Gampaha.
                                    </span>
                                </span>
                            </p>
                        </FadeInWhenVisible>

                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mt-8 sm:mt-12 px-4">
                            <FadeInWhenVisible direction="left" delay={0.5}>
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow:
                                            "0 0 25px rgba(236, 72, 153, 0.6)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium border-2 border-pink-500 text-white relative overflow-hidden group"
                                >
                                    <motion.span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="relative z-10">
                                        Register Now
                                    </span>
                                </motion.button>
                            </FadeInWhenVisible>

                            <FadeInWhenVisible direction="right" delay={0.6}>
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow:
                                            "0 0 25px rgba(236, 72, 153, 0.6)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium border-2 border-pink-500 text-white relative overflow-hidden group"
                                >
                                    <motion.span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="relative z-10">
                                        Register Now
                                    </span>
                                </motion.button>
                            </FadeInWhenVisible>
                        </div>
                    </div>
                    <motion.div
                        className="absolute bottom-20 sm:bottom-10 left-0 right-0 flex justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3, duration: 0.5 }}
                    >
                        <div className="px-6 sm:px-8 py-2 sm:py-3 rounded-full bg-purple-900/10 backdrop-blur-md flex items-center gap-3 border border-purple-500/20">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full animate-pulse" />
                            <motion.span
                                className="font-mono text-blue-100 text-sm sm:text-base"
                                animate={{
                                    textShadow: [
                                        "0 0 5px rgba(56, 189, 248, 0)",
                                        "0 0 10px rgba(56, 189, 248, 0.5)",
                                        "0 0 5px rgba(56, 189, 248, 0)",
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                May 15-17, 2025
                            </motion.span>
                        </div>
                    </motion.div>

                    {/* Scroll indicator - hidden on mobile */}
                    <motion.div
                        className="fixed bottom-10 right-10 hidden md:block"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                    >
                        <motion.div
                            className="w-8 h-14 rounded-full border-2 border-purple-400 flex justify-center pt-2"
                            animate={{
                                opacity: [0.5, 1, 0.5],
                                boxShadow: [
                                    "0 0 5px rgba(167, 139, 250, 0)",
                                    "0 0 15px rgba(167, 139, 250, 0.5)",
                                    "0 0 5px rgba(167, 139, 250, 0)",
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <motion.div
                                className="w-1 h-2 bg-purple-500"
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        </motion.div>
                    </motion.div>
                </motion.section>
            </main>
        </div>
    );
}
