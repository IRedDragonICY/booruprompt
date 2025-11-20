import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from 'react-dom';

export const TooltipWrapper = ({ children, tipContent, side = 'top', sideOffset = 8 }: { children: React.ReactNode; tipContent: React.ReactNode | string; side?: 'top' | 'right' | 'bottom' | 'left'; sideOffset?: number; }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
    const triggerRef = useRef<HTMLSpanElement>(null);
    const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const calculatePosition = useCallback(() => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            
            let top = 0;
            let left = 0;

            switch (side) {
                case 'right':
                    top = rect.top + window.scrollY + rect.height / 2;
                    left = rect.right + window.scrollX + sideOffset;
                    break;
                case 'bottom':
                    top = rect.bottom + window.scrollY + sideOffset;
                    left = rect.left + window.scrollX + rect.width / 2;
                    break;
                case 'left':
                    top = rect.top + window.scrollY + rect.height / 2;
                    left = rect.left + window.scrollX - sideOffset;
                    break;
                case 'top':
                default:
                    top = rect.top + window.scrollY - sideOffset;
                    left = rect.left + window.scrollX + rect.width / 2;
                    break;
            }

            setTooltipPosition({ top, left });
        }
    }, [side, sideOffset]);

    const handleMouseEnter = useCallback(() => {
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
        showTimeoutRef.current = setTimeout(() => {
            calculatePosition();
            setIsVisible(true);
        }, 300);
    }, [calculatePosition]);

    const handleMouseLeave = useCallback(() => {
        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
        hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 150);
    }, []);

    useEffect(() => {
        if (isVisible) {
            const handleScrollResize = () => {
                if (isVisible) {
                     calculatePosition();
                } else {
                     setIsVisible(false);
                }
            };
            window.addEventListener('scroll', handleScrollResize, true);
            window.addEventListener('resize', handleScrollResize);
            return () => {
                window.removeEventListener('scroll', handleScrollResize, true);
                window.removeEventListener('resize', handleScrollResize);
            };
        }
     }, [isVisible, calculatePosition]);


    useEffect(() => {
        return () => {
            if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        };
    }, []);

    return (
        <span ref={triggerRef} className="inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {children}
            {isMounted && createPortal(
                <AnimatePresence>
                    {isVisible && tooltipPosition && (
                        <motion.div
                            role="tooltip"
                            initial={{ opacity: 0, scale: 0.95, x: side === 'left' ? 8 : side === 'right' ? -8 : 0, y: side === 'top' ? 8 : side === 'bottom' ? -8 : 0 }}
                            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: side === 'left' ? 8 : side === 'right' ? -8 : 0, y: side === 'top' ? 8 : side === 'bottom' ? -8 : 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            style={{
                                position: 'absolute',
                                top: tooltipPosition.top,
                                left: tooltipPosition.left,
                                transform: side === 'top' ? 'translate(-50%, -100%)' : 
                                           side === 'bottom' ? 'translate(-50%, 0)' : 
                                           side === 'left' ? 'translate(-100%, -50%)' : 
                                           'translate(0, -50%)',
                                zIndex: 1000,
                            }}
                            className="pointer-events-none whitespace-nowrap rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] px-3 py-1.5 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] shadow-lg"
                        >
                            {tipContent}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </span>
    );
};
TooltipWrapper.displayName = 'TooltipWrapper';