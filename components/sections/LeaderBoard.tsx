import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Diamond, Trophy, Award, Medal, Star } from "lucide-react";
import { FadeInWhenVisible } from "../FadeInWhenVisible";
import { Title } from "../Title";

export default function SponsorsLeaderboard() {
    const [activeCategory, setActiveCategory] = useState("diamond");
    const containerRef = useRef(null);

    const sponsorTiers = [
        {
            type: "diamond",
            title: "The Diamond Sponsors",
            icon: <Diamond className="w-8 h-8" />,
            color: "from-blue-400 to-cyan-300",
            bgColor: "bg-blue-900/10",
            borderColor: "border-blue-400",
            textColor: "text-blue-400",
            sponsors: [
                {
                    id: 1,
                    name: "ICTFROMABC",
                    logo: "http://place-hold.it/200x200/666",
                    description: "Leading the digital transformation",
                },
            ],
        },
        {
            type: "platinum",
            title: "The Platinum Sponsors",
            icon: <Trophy className="w-8 h-8" />,
            color: "from-indigo-400 to-purple-400",
            bgColor: "bg-indigo-900/10",
            borderColor: "border-indigo-400",
            textColor: "text-indigo-400",
            sponsors: [
                {
                    id: 1,
                    name: "ICTFROMABC",
                    logo: "http://place-hold.it/200x200/666",
                    description: "Leading the digital transformation",
                },
            ],
        },
        {
            type: "gold",
            title: "The Gold Sponsors",
            icon: <Award className="w-8 h-8" />,
            color: "from-yellow-400 to-amber-300",
            bgColor: "bg-yellow-900/10",
            borderColor: "border-yellow-400",
            textColor: "text-yellow-400",
            sponsors: [
                {
                    id: 1,
                    name: "ICTFROMABC",
                    logo: "http://place-hold.it/200x200/666",
                    description: "Leading the digital transformation",
                },
            ],
        },
        {
            type: "silver",
            title: "The Silver Sponsors",
            icon: <Medal className="w-8 h-8" />,
            color: "from-gray-400 to-slate-300",
            bgColor: "bg-gray-800/10",
            borderColor: "border-gray-400",
            textColor: "text-gray-400",
            sponsors: [
                {
                    id: 1,
                    name: "ICTFROMABC",
                    logo: "http://place-hold.it/200x200/666",
                    description: "Leading the digital transformation",
                },
            ],
        },
        {
            type: "bronze",
            title: "The Bronze Sponsors",
            icon: <Star className="w-8 h-8" />,
            color: "from-orange-400 to-amber-300",
            bgColor: "bg-orange-900/10",
            borderColor: "border-orange-400",
            textColor: "text-orange-400",
            sponsors: [
                {
                    id: 1,
                    name: "ICTFROMABC",
                    logo: "http://place-hold.it/200x200/666",
                    description: "Leading the digital transformation",
                },
            ],
        },
    ];

    // Find active tier
    const activeTier = sponsorTiers.find(
        (tier) => tier.type === activeCategory
    );

    // Advanced animation variants
    const pageVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
    };

    const headerRevealVariants = {
        initial: { width: "100%" },
        animate: {
            width: "100%",
            transition: {
                duration: 1.2,
                ease: [0.83, 0, 0.17, 1],
            },
        },
    };

    const cardGridVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
    };

    const cardVariants = {
        initial: { opacity: 0, y: 30 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1],
            },
        },
        exit: {
            opacity: 0,
            y: 20,
            transition: {
                duration: 0.4,
                ease: [0.215, 0.61, 0.355, 1],
            },
        },
        hover: {
            y: -10,
            transition: {
                duration: 0.4,
                ease: [0.215, 0.61, 0.355, 1],
            },
        },
    };

    const iconRevealVariants = {
        initial: { scale: 0, rotate: -180 },
        animate: {
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
            },
        },
    };

    return (
        <motion.div
            ref={containerRef}
            className="min-h-screen bg-black text-white font-sans relative overflow-hidden"
            initial="initial"
            animate="animate"
            variants={pageVariants}
        >
            {/* Hero section */}
            <div className="relative z-10 pt-24 px-8 md:px-16 lg:px-24">
                {/* Animated title */}
                <FadeInWhenVisible>
                    <div className="flex flex-col items-center">
                        <Title
                            mainText="THE FUTURE OF"
                            subText="TABLETOP IS HERE"
                        />
                    </div>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.2}>
                    <motion.div className="mt-12 mb-24 md:mb-15 flex flex-nowrap relative w-full max-w-full no-scrollbar">
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-800" />

                        {sponsorTiers.map((tier, i) => (
                            <motion.div
                                key={tier.type}
                                className={`mr-6 md:mr-12 last:mr-0 relative flex-shrink-0 flex-1 flex justify-center w-full`}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <button
                                    onClick={() => setActiveCategory(tier.type)}
                                    className={`flex flex-col md:flex-row items-center pb-4 relative`}
                                >
                                    <FadeInWhenVisible delay={i * 0.3}>
                                        <div
                                            className={`p-2 rounded-full bg-gradient-to-br ${tier.color} opacity-80`}
                                        >
                                            {tier.icon}
                                        </div>
                                    </FadeInWhenVisible>
                                    {activeCategory === tier.type && (
                                        <motion.div
                                            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tier.color}`}
                                            layoutId="activeTab"
                                        />
                                    )}
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="mb-20">
                        <FadeInWhenVisible delay={0.4} direction="left">
                            <div className="overflow-hidden">
                                <motion.div
                                    className="relative h-16 mb-12 overflow-hidden"
                                    initial="initial"
                                    animate="animate"
                                    key={activeTier?.type}
                                >
                                    <motion.div
                                        className="absolute inset-0 flex items-center"
                                        variants={headerRevealVariants}
                                    >
                                        <div className="flex items-center">
                                            <motion.div
                                                className={`p-3 rounded-lg bg-gradient-to-br ${activeTier?.color} mr-4`}
                                                variants={iconRevealVariants}
                                            >
                                                {activeTier?.icon}
                                            </motion.div>

                                            <div>
                                                <motion.h2
                                                    className="text-3xl font-bold mb-1"
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        delay: 0.3,
                                                        duration: 0.6,
                                                    }}
                                                >
                                                    {activeTier?.title}
                                                </motion.h2>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </FadeInWhenVisible>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategory}
                                variants={cardGridVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {activeTier?.sponsors.map((sponsor) => (
                                    <motion.div
                                        key={`${activeCategory}-${sponsor.id}`}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        className="relative group"
                                    >
                                        <motion.div
                                            className={`
                      relative p-8 py-12 rounded-lg overflow-hidden backdrop-blur-sm
                      ${activeTier.bgColor} border border-gray-800
                      group-hover:border-opacity-100 transition-all duration-300
                    `}
                                        >
                                            {/* Logo container */}
                                            <div className="mb-6 h-24 flex items-center justify-center">
                                                <img
                                                    src={sponsor.logo}
                                                    alt={sponsor.name}
                                                    className="max-w-full max-h-20 object-contain"
                                                />
                                            </div>

                                            {/* Sponsor info */}
                                            <div className="text-center">
                                                <h3
                                                    className={`text-lg font-bold mb-2 ${activeTier.textColor}`}
                                                >
                                                    {sponsor.name}
                                                </h3>

                                                <p className="text-sm text-gray-400">
                                                    {sponsor.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </FadeInWhenVisible>
            </div>
        </motion.div>
    );
}
