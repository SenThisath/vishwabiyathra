"use client";

import { FadeInWhenVisible } from "../FadeInWhenVisible";
import { Title } from "../Title";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

export default function Sponsors() {
  const platinumRef = useRef(null);
  const line1Ref = useRef(null);
  const goldLineRef = useRef(null);
  const silverLineRef = useRef(null);
  const bronzeLineRef = useRef(null);

  const goldContainerRef = useRef(null);
  const silverContainerRef = useRef(null);
  const bronzeContainerRef = useRef(null);

  const platinumInView = useInView(platinumRef, { once: false, amount: 0.5 });
  const line1InView = useInView(line1Ref, { once: false, amount: 0.8 });
  const goldLineInView = useInView(goldLineRef, { once: false, amount: 0.5 });
  const silverLineInView = useInView(silverLineRef, {
    once: false,
    amount: 0.5,
  });
  const bronzeLineInView = useInView(bronzeLineRef, {
    once: false,
    amount: 0.5,
  });

  const goldContainerInView = useInView(goldContainerRef, {
    once: true,
    amount: 0.3,
  });
  const silverContainerInView = useInView(silverContainerRef, {
    once: true,
    amount: 0.3,
  });
  const bronzeContainerInView = useInView(bronzeContainerRef, {
    once: true,
    amount: 0.3,
  });

  interface Sponsor {
    logo: string;
    company: string;
    name: string;
  }

  const [sponsors] = useState<{
    main: Sponsor | null;
    gold: Sponsor[];
    silver: Sponsor[];
    bronze: Sponsor[];
  }>({
    main: null,
    gold: [],
    silver: [],
    bronze: [],
  });

  //   const [sponsors] = useState({
  //   main: {
  //     name: "Platinum Sponsor",
  //     logo: "/api/placeholder/500/300",
  //     company: "Tech Solutions Inc.",
  //   },
  //   gold: [
  //     { name: "Gold Sponsor", logo: "/api/placeholder/500/300", company: "Digital Innovations" },
  //     { name: "Gold Sponsor", logo: "/api/placeholder/500/300", company: "Future Systems" },
  //   ],
  //   silver: [
  //     { name: "Silver Sponsor", logo: "/api/placeholder/500/300", company: "WebTech Co." },
  //     { name: "Silver Sponsor", logo: "/api/placeholder/500/300", company: "Creative Design" },
  //     { name: "Silver Sponsor", logo: "/api/placeholder/500/300", company: "Cloud Services" },
  //   ],
  //   bronze: [
  //     { name: "Bronze Sponsor", logo: "/api/placeholder/500/300", company: "Local Business" },
  //     { name: "Bronze Sponsor", logo: "/api/placeholder/500/300", company: "Startup Hub" },
  //     { name: "Bronze Sponsor", logo: "/api/placeholder/500/300", company: "Marketing Pro" },
  //     { name: "Bronze Sponsor", logo: "/api/placeholder/500/300", company: "Tech Academy" },
  //   ],
  // });

  const isLoading =
    !sponsors.main &&
    sponsors.gold.length === 0 &&
    sponsors.silver.length === 0 &&
    sponsors.bronze.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-black ">
      <section
        id="sponsors"
        className="min-h-screen py-8 md:py-16 lg:py-24 relative z-10 flex flex-col items-center justify-center"
      >
        <div className="absolute inset-0 pointer-events-none" />
        <div className="z-10 px-4 md:px-8 lg:px-16 w-full max-w-7xl mx-auto text-center">
          <FadeInWhenVisible>
            <div className="flex flex-col items-center mb-24">
              <Title subText="Sponsors & Partners" />
            </div>
          </FadeInWhenVisible>

          {isLoading ? (
            <div className="bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(234,179,8,0.3)] backdrop-blur-sm comicFont">
              <div className="min-h-[50vh] flex flex-col items-center justify-center bg-black text-white text-center px-4 py-10 comicFont">
                <motion.h2
                  className="text-3xl md:text-4xl font-extrabold tracking-wide bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 
    bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  Sponsor information is on the way...
                </motion.h2>

                <motion.p
                  className="mt-4 text-lg text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  Stay tuned while we finalize our amazing partners!
                </motion.p>

                <div className="flex space-x-2 mt-8">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-4 h-4 bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full p-4 min-h-screen comicFont">
              {/* Main/Platinum Sponsor */}
              <div className="flex justify-center mb-12" ref={platinumRef}>
                <motion.div
                  className="sponsor-card platinum-sponsor bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-600 max-w-xs w-full transform"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    platinumInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{ duration: 0.5 }}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 15px 30px -10px rgba(79, 70, 229, 0.3)",
                  }}
                >
                  <div className="flex flex-col items-center">
                    <Image
                      src={sponsors.main?.logo || ""}
                      alt={sponsors.main?.company || "Sponsor"}
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-indigo-800 mb-1">
                    {sponsors.main?.company}
                  </h3>
                  <span className="text-indigo-600 font-semibold uppercase tracking-wider text-sm">
                    {sponsors.main?.name}
                  </span>
                </motion.div>
              </div>

              {/* Connecting Line */}
              <motion.div
                ref={line1Ref}
                className="flex justify-center"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={
                  line1InView
                    ? { opacity: 1, scaleY: 1 }
                    : { opacity: 0, scaleY: 0 }
                }
                transition={{ duration: 0.3 }}
              >
                <div className="w-0.5 h-5 bg-gradient-to-b from-indigo-600 to-yellow-500"></div>
              </motion.div>

              {/* Gold Sponsors */}
              <div className="relative mb-16" ref={goldLineRef}>
                <motion.div
                  className="h-0.5 w-4/5 md:w-3/4 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 mx-auto rounded-full"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={
                    goldLineInView
                      ? { opacity: 1, scaleX: 1 }
                      : { opacity: 0, scaleX: 0 }
                  }
                  transition={{ duration: 0.5 }}
                ></motion.div>

                {/* Gold Sponsors Container */}
                <div
                  className="flex flex-wrap justify-center md:justify-around gap-8 mt-16"
                  ref={goldContainerRef}
                >
                  {sponsors.gold.map((sponsor, index) => (
                    <div key={`gold-${index}`} className="relative md:px-4">
                      <motion.div
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={
                          goldContainerInView
                            ? { opacity: 1, scaleY: 1 }
                            : { opacity: 0, scaleY: 0 }
                        }
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="h-5 w-0.5 bg-gradient-to-b from-red-500 to-yellow-400"></div>
                      </motion.div>
                      <motion.div
                        className="sponsor-card gold-sponsor bg-white p-5 rounded-xl shadow-md border-t-4 border-yellow-500 max-w-xs w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          goldContainerInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                        whileHover={{
                          y: -6,
                          boxShadow: "0 12px 25px -7px rgba(234, 179, 8, 0.3)",
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="rounded-full bg-yellow-50 p-3 mb-3">
                            <img
                              src={sponsor.logo}
                              alt={sponsor.company}
                              className="rounded"
                            />
                          </div>
                          <h3 className="text-xl font-bold text-yellow-700 mb-1">
                            {sponsor.company}
                          </h3>
                          <span className="text-yellow-600 font-semibold uppercase tracking-wider text-xs">
                            {sponsor.name}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Silver Sponsors */}
              <div className="relative mb-16" ref={silverLineRef}>
                <motion.div
                  className="h-0.5 w-11/12 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 mx-auto rounded-full"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={
                    silverLineInView
                      ? { opacity: 1, scaleX: 1 }
                      : { opacity: 0, scaleX: 0 }
                  }
                  transition={{ duration: 0.5 }}
                ></motion.div>

                {/* Silver Sponsors Container */}
                <div
                  className="flex flex-wrap justify-center gap-6 mt-16"
                  ref={silverContainerRef}
                >
                  {sponsors.silver.map((sponsor, index) => (
                    <div key={`silver-${index}`} className="relative">
                      <motion.div
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={
                          silverContainerInView
                            ? { opacity: 1, scaleY: 1 }
                            : { opacity: 0, scaleY: 0 }
                        }
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="h-5 w-0.5 bg-gradient-to-b from-gray-400 to-gray-300"></div>
                      </motion.div>
                      <motion.div
                        className="sponsor-card silver-sponsor bg-white p-4 rounded-xl shadow-md border-t-4 border-gray-400 w-64"
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          silverContainerInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                        whileHover={{
                          y: -5,
                          boxShadow:
                            "0 10px 20px -5px rgba(156, 163, 175, 0.3)",
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="rounded-full bg-gray-50 p-3 mb-3">
                            <img
                              src={sponsor.logo}
                              alt={sponsor.company}
                              className="rounded"
                            />
                          </div>
                          <h3 className="text-lg font-bold text-gray-700 mb-1">
                            {sponsor.company}
                          </h3>
                          <span className="text-gray-600 font-semibold uppercase tracking-wider text-xs">
                            {sponsor.name}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bronze Sponsors */}
              <div className="relative" ref={bronzeLineRef}>
                <motion.div
                  className="h-0.5 w-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 mx-auto rounded-full"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={
                    bronzeLineInView
                      ? { opacity: 1, scaleX: 1 }
                      : { opacity: 0, scaleX: 0 }
                  }
                  transition={{ duration: 0.5 }}
                ></motion.div>

                {/* Bronze Sponsors Container */}
                <div
                  className="flex flex-wrap justify-center gap-4 mt-16"
                  ref={bronzeContainerRef}
                >
                  {sponsors.bronze.map((sponsor, index) => (
                    <div key={`bronze-${index}`} className="relative">
                      <motion.div
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={
                          bronzeContainerInView
                            ? { opacity: 1, scaleY: 1 }
                            : { opacity: 0, scaleY: 0 }
                        }
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <div className="h-5 w-0.5 bg-gradient-to-b from-amber-700 to-amber-600"></div>
                      </motion.div>
                      <motion.div
                        className="sponsor-card bronze-sponsor bg-white p-3 rounded-xl shadow-md border-t-4 border-amber-700 w-56"
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          bronzeContainerInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 20 }
                        }
                        transition={{
                          duration: 0.4,
                          delay: 0.1 + index * 0.05,
                        }}
                        whileHover={{
                          y: -4,
                          boxShadow: "0 8px 15px -4px rgba(146, 64, 14, 0.25)",
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="rounded-full bg-amber-50 p-2 mb-2">
                            <img
                              src={sponsor.logo}
                              alt={sponsor.company}
                              className="rounded w-12"
                            />
                          </div>
                          <h3 className="text-base font-bold text-amber-800 mb-1">
                            {sponsor.company}
                          </h3>
                          <span className="text-amber-700 font-semibold uppercase tracking-wider text-xs">
                            {sponsor.name}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
