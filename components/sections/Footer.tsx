"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
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
        { name: "About", href: "#about" },
        { name: "Leaderboard", href: "#leaderboard" },
        { name: "Competitions", href: "#competitions" },
        { name: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Gallery", href: "#gallery" },
        { name: "Past Events", href: "#events" },
        { name: "Team", href: "#team" },
        { name: "FAQ", href: "#faq" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com",
      color: "hover:text-blue-500",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com",
      color: "hover:text-pink-500",
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: "https://youtube.com",
      color: "hover:text-red-500",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com",
      color: "hover:text-blue-400",
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      content: "bcss@gmail.com",
      href: "mailto:bcss@gmail.com",
      color: "text-purple-500",
    },
    {
      icon: Phone,
      content: "+94 71 054 8515",
      href: "tel:+94710548515",
      color: "text-blue-500",
    },
    {
      icon: MapPin,
      content: "Bandarayanayaka College, Sri Lanka",
      href: "https://maps.google.com",
      color: "text-red-500",
    },
  ];

  return (
    <footer className="relative bg-[#0d0d0d] comicFont">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"></div>

      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Logo & description section */}
          <div className="lg:col-span-4">
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

            <div className="flex items-center mb-6">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="ml-2 text-xs uppercase tracking-wider text-green-400 font-medium">
                Now Live: Registration for 2025 Competition
              </span>
            </div>

            {/* Social media links */}
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className={`w-9 h-9 rounded-full bg-white/10 flex items-center justify-center 
                             ${social.color} hover:bg-white/20 transition-all duration-300 
                             transform hover:scale-110 hover:rotate-6`}
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links section */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 gap-8">
              {footerLinks.map((section, i) => (
                <div key={i}>
                  <h3
                    className="text-sm uppercase tracking-widest mb-4 font-medium text-gray-400 
                                border-b border-gray-800 pb-2"
                  >
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
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
          <div className="lg:col-span-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <h3 className="text-sm uppercase tracking-widest mb-4 font-medium">
                Stay Connected
              </h3>

              {/* Contact information */}
              <div className="space-y-3 mb-6">
                {contactInfo.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="flex items-center text-gray-300 hover:text-white transition-all duration-300 group"
                  >
                    <div
                      className={`${item.color} mr-3 p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300`}
                    >
                      <item.icon size={16} />
                    </div>
                    <span className="text-sm">{item.content}</span>
                  </Link>
                ))}
              </div>

              {/* Newsletter signup */}
              <div>
                <h4 className="text-sm font-medium mb-3">
                  Join our newsletter
                </h4>
                <form className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 bg-white/5 border border-white/10 rounded-l-lg px-3 py-2 text-sm 
                             focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600
                             rounded-r-lg px-3 flex items-center justify-center transition-all duration-300 transform hover:scale-105"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom credits section */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Bandarayanayaka College Science
            Society. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Designed with 💜 by{" "}
            <span className="text-purple-400">Senuka Thisath</span>
          </p>
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
