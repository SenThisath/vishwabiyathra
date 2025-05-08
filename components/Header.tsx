// Navbar.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Home, Info, Trophy, Target, Phone } from "lucide-react";

const menuItems = [
    { number: "(1)", title: "HOME", href: "/", icon: Home },
    { number: "(2)", title: "ABOUT", href: "#about", icon: Info },
    { number: "(3)", title: "LEADER BOARD", href: "/", icon: Trophy },
    { number: "(4)", title: "COMPETITIONS", href: "/", icon: Target },
    { number: "(5)", title: "CONTACT US", href: "/", icon: Phone },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Animation variants
    const menuItemVariants = {
        closed: {
            opacity: 0,
            y: 20,
        },
        open: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.1 + i * 0.1,
                ease: [0.6, 0.01, 0, 0.95],
                duration: 0.6,
            },
        }),
    };

    const contactItemVariants = {
        closed: {
            opacity: 0,
            y: 20,
        },
        open: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.5 + i * 0.1,
                ease: [0.6, 0.01, 0, 0.95],
                duration: 0.6,
            },
        }),
    };

    const logoVariants = {
        closed: {
            opacity: 0,
            scale: 0.8,
        },
        open: {
            opacity: 1,
            scale: 1,
            transition: {
                delay: 0.2,
                ease: [0.6, 0.01, 0, 0.95],
                duration: 0.5,
            },
        },
    };

    return (
        <header className="fixed w-full z-50 h-20">
            <div className="flex justify-between items-center py-6 px-8 bg-transparent">
                {!isOpen && (
                    <Link href="/" className="relative z-50">
                        <span className="text-lg font-bold">
                            VISHWABHIYATHRA
                        </span>
                    </Link>
                )}

                <button
                    onClick={toggleMenu}
                    className={`${
                        isOpen ? "hidden" : "block"
                    } relative z-50 flex flex-col justify-center items-center space-y-1.5 w-8 h-8 focus:outline-none`}
                    aria-label="Toggle Menu"
                >
                    <motion.span
                        animate={
                            isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                        }
                        className="block w-6 h-0.5 bg-white"
                        transition={{ duration: 0.3 }}
                    />
                    <motion.span
                        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                        className="block w-6 h-0.5 bg-white"
                        transition={{ duration: 0.3 }}
                    />
                    <motion.span
                        animate={
                            isOpen
                                ? { rotate: -45, y: -6 }
                                : { rotate: 0, y: 0 }
                        }
                        className="block w-6 h-0.5 bg-white"
                        transition={{ duration: 0.3 }}
                    />
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 flex"
                    >
                        {/* Left side - Menu */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{
                                duration: 0.5,
                                ease: [0.6, 0.01, 0, 0.95],
                            }}
                            className="w-full lg:w-3/5 bg-black overflow-y-auto"
                        >
                            <div className="h-full">
                                <nav className="h-full overflow-hidden">
                                    <div className="h-full flex flex-col">
                                        {menuItems.map((item, i) => (
                                            <motion.div
                                                key={i}
                                                custom={i}
                                                initial="closed"
                                                animate="open"
                                                exit="closed"
                                                variants={menuItemVariants}
                                                className="border-b border-[#e0d7c5] flex-1"
                                            >
                                                <Link
                                                    href={item.href}
                                                    className="flex justify-between items-center py-6 px-8 hover:bg-[#e0d7c5] transition-colors duration-300 h-full"
                                                    onClick={() =>
                                                        setIsOpen(false)
                                                    }
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-sm font-light text-[#8b7f6c]">
                                                            {item.number}
                                                        </span>
                                                        <span className="text-3xl font-light">
                                                            {item.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#b3957a] text-white">
                                                        <item.icon
                                                            size={24}
                                                            color="white"
                                                        />
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </nav>
                            </div>
                        </motion.div>

                        {/* Right side - Contact & Logo */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{
                                duration: 0.5,
                                ease: [0.6, 0.01, 0, 0.95],
                            }}
                            className="hidden lg:block w-2/5 bg-white text-black py-6 px-8 h-screen"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex justify-end">
                                    <motion.button
                                        onClick={() => setIsOpen(false)}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        CLOSE
                                    </motion.button>
                                </div>

                                <div className="flex pt-12">
                                    <motion.div
                                        variants={logoVariants}
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                        className="relative w-full max-w-[500px] h-[200px]"
                                    >
                                        <Image
                                            src="/logo.png"
                                            alt="Logo"
                                            className="object-contain invert mt-5"
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority
                                        />
                                        <h1 className="font-extrabold uppercase bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent tracking-wider leading-relaxed mt-4">
                                            A Paradise Where Legends Are Born
                                        </h1>
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-2 gap-12 mt-12">
                                    {[
                                        {
                                            title: "EMAIL",
                                            content: ["bcss@gmail.com"],
                                        },
                                        {
                                            title: "PHONE",
                                            content: ["+94 71 054 8515)"],
                                        },
                                        {
                                            title: "MONDAY TO FRIDAY",
                                            content: ["9:00 AM - 6:00 PM"],
                                        },
                                        {
                                            title: "SOCIAL",
                                            content: [
                                                "INSTAGRAM",
                                                "FACEBOOK",
                                                "TWITTER (X)",
                                            ],
                                        },
                                    ].map((item, index) => (
                                        <motion.div
                                            key={item.title}
                                            custom={index}
                                            variants={contactItemVariants}
                                            initial="closed"
                                            animate="open"
                                            exit="closed"
                                            className="group"
                                        >
                                            <h3 className="text-lg font-medium mb-3 tracking-wide">
                                                {item.title}
                                            </h3>
                                            {item.content.map((line, i) => (
                                                <p
                                                    key={i}
                                                    className="text-sm opacity-70 hover:opacity-100 transition-opacity cursor-pointer mb-1"
                                                >
                                                    {line}
                                                </p>
                                            ))}
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    custom={6}
                                    variants={contactItemVariants}
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    className="mt-auto pt-8 flex justify-between items-center border-t border-gray-200"
                                >
                                    <p className="text-sm opacity-70">
                                        © 2025 - BCSS - Senuka Thisath
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
