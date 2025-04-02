import React, {useMemo} from "react";
import {motion} from "framer-motion";

export const AnimatedIcon = ({ children, isActive = false, animation = "default" }: { children: React.ReactNode, isActive?: boolean, animation?: "default" | "spin" | "gentle" }) => {
    const variants = useMemo(() => ({
        default: {
            hover: { scale: 1.15, rotate: isActive ? 0 : 5 },
            tap: { scale: 0.9 },
            active: { scale: 1.1, transition: { type: 'spring', stiffness: 300, damping: 10 } },
            inactive: { scale: 1 }
        },
        spin: {
            hover: { scale: 1.2, rotate: 360 },
            tap: { scale: 0.9 },
            active: { rotate: 360, transition: { duration: 0.5, ease: 'easeInOut' } },
            inactive: { rotate: 0 }
        },
        gentle: {
            hover: { scale: 1.1 },
            tap: { scale: 0.95 },
            active: { scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 15 } },
            inactive: { scale: 1 }
        }
    }), [isActive]);

    return (
        <motion.span
            className="inline-flex items-center justify-center"
            variants={variants[animation]}
            initial="inactive"
            animate={isActive ? "active" : "inactive"}
            whileHover="hover"
            whileTap="tap"
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
            {children}
        </motion.span>
    );
};
AnimatedIcon.displayName = 'AnimatedIcon';