"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Info,
  Trophy,
  Phone,
  X,
  Menu,
  Gamepad2,
  Users,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const menuItems = [
  {
    number: "01",
    title: "HOME",
    href: "/",
    icon: Home,
    color: "from-purple-500 to-blue-500",
  },
  {
    number: "02",
    title: "ABOUT",
    href: "#about",
    icon: Info,
    color: "from-blue-500 to-teal-500",
  },
  {
    number: "05",
    title: "COMPETITIONS",
    href: "/",
    icon: Gamepad2,
    color: "from-red-500 to-pink-500",
  },
  {
    number: "04",
    title: "LEADERBOARD",
    href: "/",
    icon: Trophy,
    color: "from-yellow-500 to-orange-500",
  },
  {
    number: "04",
    title: "SPONSORS",
    href: "/",
    icon: Trophy,
    color: "from-yellow-500 to-orange-500",
  },
  {
    number: "06",
    title: "CONTACT US",
    href: "/",
    icon: Phone,
    color: "from-indigo-500 to-purple-500",
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Close menu when screen size changes from mobile to desktop
  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed w-full z-50 overflow-hidden comicFont">
  <div className="flex justify-between items-center py-1 xs:py-2 sm:py-4 px-3 xs:px-4 sm:px-6 lg:px-6 bg-black/30 backdrop-blur-md overflow-hidden border-b border-white/10">
        {/* Logo */}
        <Link href="/" className="relative z-50 flex items-center pl-5">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Logo"
              className="object-contain w-24 xs:w-28 sm:w-32 md:w-45 h-auto"
              width={150}
              height={150}
              priority
            />
          </div>
        </Link>

        {/* Sign In / User Button and Mobile Menu Toggle */}
        <div className="flex items-center">
          <nav className="hidden md:flex items-center space-x-6 mx-10">
            {menuItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="text-xl text-white font-light hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-600 transition-all duration-200"
              >
                <span className="flex items-center">{item.title}</span>
              </Link>
            ))}
          </nav>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black">
                <Users size={14} className="mr-1" />
                <span className="hidden xs:inline">Sign In</span>
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

          <button
            onClick={toggleMenu}
            className="md:hidden relative z-50 bg-gradient-to-r from-indigo-500 to-purple-600 p-1.5 xs:p-2 rounded-md focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X size={18} className="text-white" />
            ) : (
              <Menu size={18} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100vh - 1rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-x-0 top-0 z-40 flex flex-col w-screen overflow-hidden bg-gradient-to-b from-gray-900 via-black to-purple-900/80"
          >
            <div className="flex justify-between items-center p-3 xs:p-4 border-b border-gray-800/50">
              <Link
                href="/"
                className="relative flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <Image
                  src="/logo.png"
                  alt="Logo"
                  className="object-contain w-24 xs:w-28 sm:w-32"
                  width={120}
                  height={120}
                  priority
                />
                <span className="ml-1 xs:ml-2 text-[10px] xs:text-xs font-bold text-white uppercase tracking-widest">
                  BCSS 2025
                </span>
              </Link>

              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center h-8 w-8 xs:h-10 xs:w-10 text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-full transition-all duration-300 transform hover:scale-105 hover:rotate-12"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative flex flex-col h-full overflow-auto">
              {/* Decorative elements */}
              <div className="absolute top-10 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl"></div>

              {/* Menu title */}
              <div className="text-center py-4 xs:py-6">
                <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  EXPLORE BCSS
                </h2>
                <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-2"></div>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 px-3 xs:px-4 sm:px-6 md:px-8 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3">
                  {menuItems.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                    >
                      <Link
                        href={item.href}
                        className="flex justify-between items-center p-3 xs:p-4 hover:bg-white/5 transition-colors duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center space-x-2 xs:space-x-4">
                          <div
                            className={`flex flex-col items-center justify-center w-10 h-10 xs:w-12 xs:h-12 rounded-lg bg-gradient-to-br ${item.color} text-white shadow-lg`}
                          >
                            <span className="text-xs font-bold">
                              {item.number}
                            </span>
                          </div>
                          <span className="text-lg xs:text-xl sm:text-2xl font-medium text-white">
                            {item.title}
                          </span>
                        </div>
                        <div className="w-6 h-6 xs:w-8 xs:h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 xs:h-4 xs:w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>

              <div className="bg-white/10 backdrop-blur-lg py-4 xs:py-6 px-4 xs:px-6 rounded-t-3xl mt-2 xs:mt-4 border-t border-white/20">
                <div className="mb-3 xs:mb-4">
                  <h2 className="text-lg xs:text-xl font-bold text-white mb-1">
                    GET IN TOUCH
                  </h2>
                  <p className="text-white/70 text-xs xs:text-sm">
                    We&apos;d love to hear from you
                  </p>
                </div>

                {/* Contact grid that adapts to extra small screens */}
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 xs:gap-6">
                  {[
                    {
                      title: "EMAIL",
                      content: ["bcss@gmail.com"],
                      icon: "📧",
                    },
                    {
                      title: "PHONE",
                      content: ["+94 71 054 8515"],
                      icon: "📱",
                    },
                    {
                      title: "FOLLOW US",
                      content: ["Stay connected for updates"],
                      icon: "🌐",
                    },
                  ].map((item) => (
                    <div key={item.title} className="group">
                      <h3 className="text-sm font-bold mb-1 xs:mb-2 tracking-wide flex items-center text-white">
                        <span className="mr-2 bg-white/10 w-6 h-6 xs:w-8 xs:h-8 rounded-full flex items-center justify-center text-xs xs:text-sm">
                          {item.icon}
                        </span>
                        {item.title}
                      </h3>
                      {item.content.map((line, i) => (
                        <p
                          key={i}
                          className="text-xs text-white/70 hover:text-white transition-all cursor-pointer mb-1 pl-8 xs:pl-10 hover:pl-9 xs:hover:pl-12"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Social Media Icons */}
                <div className="mt-4 xs:mt-6 pt-3 xs:pt-4 flex flex-col xs:flex-row justify-between items-center border-t border-white/20">
                  <p className="text-xs text-white/70 mb-3 xs:mb-0">
                    © 2025 - BCSS - Senuka Thisath
                  </p>
                  <div className="flex space-x-3">
                    {["FB", "IG", "YT", "TW"].map((social, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white cursor-pointer shadow-md shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-110 transition-all duration-300"
                      >
                        <span className="text-[10px] xs:text-xs font-bold">
                          {social}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
