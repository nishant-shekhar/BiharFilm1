import React from "react";
import { motion } from "framer-motion";

const AnimatedSection = ({
    children,
    delay = 0,
    duration = 0.8,
    yOffset = 50,
    xOffset = 0,
    scale = 1,
    once = true,
    amount = 0.2
}) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: yOffset,
                x: xOffset,
                scale: scale === 1 ? 1 : 0.95
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1
            }}
            viewport={{
                once: once,
                amount: amount
            }}
            transition={{
                duration: duration,
                delay: delay,
                ease: [0.25, 0.1, 0.25, 1]
            }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedSection;
