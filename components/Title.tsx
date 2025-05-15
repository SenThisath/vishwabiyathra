import { motion } from "framer-motion";

export const Title = ({
    mainText,
    subText,
    bgText = "VISHWABHIYATHRA",
}: {
    mainText: string;
    subText: string;
    bgText?: string;
}) => {
    return (
        <div className={`relative py-8`}>
            <div className="absolute inset-0 flex items-center justify-center opacity-20 text-gray-700">
                <span className="text-4xl md:text-6xl lg:text-7xl font-black whitespace-nowrap">
                    {bgText}
                </span>
            </div>

            <div className="relative z-10 text-center">
                <motion.h2
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {mainText}
                </motion.h2>

                <motion.h3
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                        {subText}
                    </span>
                </motion.h3>
            </div>
        </div>
    );
};
