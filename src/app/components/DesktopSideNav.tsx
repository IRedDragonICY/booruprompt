import React from 'react';
import { motion } from 'framer-motion';
import { TagIcon, PhotoIcon, CogIcon } from './icons/icons';
import { TooltipWrapper } from './TooltipWrapper';
import type { ActiveView } from '../types/settings';

interface DesktopSideNavProps {
    active: ActiveView;
    highlightSettings?: boolean;
    onSelectExtractor: () => void;
    onSelectImage: () => void;
    onOpenSettings: () => void;
}

const navButtonClass = (isActive: boolean) => `group relative overflow-hidden rounded-2xl h-12 md:h-12 w-full md:w-12 flex-1 md:flex-none flex items-center justify-center transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))] ${isActive ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.15)] ring-1 ring-[rgb(var(--color-primary-rgb))]/40 shadow-sm' : 'text-[rgb(var(--color-on-surface-muted-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))] hover:text-[rgb(var(--color-on-surface-rgb))]'}`;

export function DesktopSideNav({ active, highlightSettings = false, onSelectExtractor, onSelectImage, onOpenSettings }: DesktopSideNavProps) {
    return (
        <div className="hidden md:block flex-shrink-0 md:mr-4 md:mb-0 z-20 md:self-start">
            <div className="flex md:flex-col flex-row md:space-y-2 space-y-0 space-x-2 md:space-x-0 rounded-2xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] p-2 shadow-xl">
                <TooltipWrapper tipContent="Tag Extractor">
                    <motion.button whileTap={{ scale: 0.96 }} onClick={onSelectExtractor} className={navButtonClass(active === 'extractor')} aria-label="Tag Extractor" aria-current={active === 'extractor' ? 'page' : undefined}>
                        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-current opacity-0 group-active:opacity-10 transition-opacity duration-200" />
                        <TagIcon />
                    </motion.button>
                </TooltipWrapper>
                <TooltipWrapper tipContent="Image Metadata">
                    <motion.button whileTap={{ scale: 0.96 }} onClick={onSelectImage} className={navButtonClass(active === 'image')} aria-label="Image Metadata" aria-current={active === 'image' ? 'page' : undefined}>
                        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-current opacity-0 group-active:opacity-10 transition-opacity duration-200" />
                        <PhotoIcon className="h-6 w-6" />
                    </motion.button>
                </TooltipWrapper>
                <div className="hidden md:block my-1 h-[1px] bg-[rgb(var(--color-surface-border-rgb))]" />
                <TooltipWrapper tipContent="Settings">
                    <motion.button whileTap={{ scale: 0.96 }} onClick={onOpenSettings} className={navButtonClass(!!highlightSettings)} aria-label="Settings">
                        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-current opacity-0 group-active:opacity-10 transition-opacity duration-200" />
                        <CogIcon />
                    </motion.button>
                </TooltipWrapper>
            </div>
        </div>
    );
}

export default DesktopSideNav;


