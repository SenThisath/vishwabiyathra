"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MouseFollower = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);
    return (
        <motion.div
            className="fixed pointer-events-none w-64 h-64 rounded-full hidden md:block"
            style={{
                background:
                    "radial-gradient(circle, rgba(88,21,176,0.3) 0%, rgba(131,58,180,0) 70%)",
                x: mousePosition.x - 128,
                y: mousePosition.y - 128,
            }}
            transition={{ type: "spring", damping: 15 }}
        />
    );
};

export default MouseFollower;
