"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Youtube,
  ArrowRight,
  ChevronUp,
  Linkedin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  // Check scroll position for back-to-top button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "/" },
        { name: "Introduction", href: "#introduction" },
        { name: "Competitions", href: "#competitions" },
        { name: "Leaderboard", href: "#leaderboard" },
        { name: "Sponsors", href: "#sponsors" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://www.facebook.com/bcsciencesociety",
      color: "hover:text-blue-500",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/bc_sciencesociety",
      color: "hover:text-pink-500",
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: "https://youtube.com/@bc_science_society",
      color: "hover:text-red-500",
    },
    {
      name: "Linkedin",
      icon: Linkedin,
      href: "https://www.linkedin.com/company/science-society-bandaranayake-college/",
      color: "hover:text-blue-400",
    },
  ];

  return (
    <footer className="relative bg-[#0d0d0d] comicFont" id="contactus">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 justify-center">
          {/* Logo & description section */}
          <div>
            <div className="flex items-center mb-4">
              <Image
                src="/logo.png"
                alt="BCSS Logo"
                width={150}
                height={150}
                className="object-contain"
                priority
              />
              <span className="ml-3 text-lg font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                BCSS 2025
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-sm">
              Bandarayanayaka College Science Society - A paradise where legends
              are born. Join us in exploring the wonders of science and
              technology.
            </p>
          </div>

          {/* Links section */}
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 gap-8 text-center">
              {footerLinks.map((section, i) => (
                <div key={i}>
                  <h3
                    className="text-sm uppercase tracking-widest mb-4 font-medium text-gray-400 
            border-b border-gray-800 pb-2"
                  >
                    {section.title}
                  </h3>
                  <ul>
                    {section.links.map((link, j) => (
                      <li key={j}>
                        <Link
                          href={link.href}
                          className="text-sm text-gray-300 hover:text-white transition-colors 
               duration-300 flex items-center group"
                        >
                          <ArrowRight
                            size={14}
                            className="mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                          />
                          <span>{link.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & newsletter section */}
          <div>
            <h3 className="text-white text-sm uppercase tracking-widest mb-4 font-medium">
              Stay{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Connected
              </span>
            </h3>
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className={`w-9 h-9 rounded-full bg-white flex items-center justify-center 
             ${social.color} hover:bg-white/20 transition-all duration-300 
             transform hover:scale-110 hover:rotate-6`}
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom credits section */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Bandarayanayake College Science
            Society. All rights reserved.
          </p>
          {/* <p className="text-xs text-gray-500">
        Designed with 💜 by{" "}
        <span className="text-purple-400">Designed By BCSS Web</span>
          </p> */}
        </div>
      </div>

      {/* Back to top button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 
                  flex items-center justify-center shadow-lg shadow-purple-500/20 z-50
                  hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-110
                  ${isVisible ? "visible" : "invisible"}`}
        aria-label="Back to top"
      >
        <ChevronUp size={20} className="text-white" />
      </motion.button>
    </footer>
  );
}
