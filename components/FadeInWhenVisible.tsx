"use client";

import { motion, useAnimation, useInView } from "motion/react";
import { ReactNode, useEffect, useRef } from "react";

export const FadeInWhenVisible = ({
    children,
    delay = 0,
    direction = "up",
}: {
    children: ReactNode;
    delay?: number;
    direction?: string;
}) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });

    const variants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            rotate: direction === "left" ? -10 : direction === "right" ? 10 : 0,
            x: direction === "left" ? -50 : direction === "right" ? 50 : 0,
            y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
        },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay: delay,
                duration: 0.6,
            },
        },
    };

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        } else {
            controls.start("hidden");
        }
    }, [controls, isInView]);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            style={{ transformOrigin: "center" }}
        >
            {children}
        </motion.div>
    );
};
