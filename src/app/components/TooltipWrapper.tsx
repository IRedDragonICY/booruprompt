import React, {useCallback, useEffect, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

export const TooltipWrapper = ({ children, tipContent }: { children: React.ReactNode; tipContent: React.ReactNode | string; }) => {
    const [isVisible, setIsVisible] = useState(false);
    const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = useCallback(() => {
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
        showTimeoutRef.current = setTimeout(() => setIsVisible(true), 300);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
        hideTimeoutRef.current = setTimeout(() => setIsVisible(false), 150);
    }, []);

    useEffect(() => {
        return () => {
            if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        };
    }, []);

    return (
        <span className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        role="tooltip"
                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 5 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white shadow-md dark:bg-gray-100 dark:text-gray-900"
                    >
                        {tipContent}
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
};
TooltipWrapper.displayName = 'TooltipWrapper';