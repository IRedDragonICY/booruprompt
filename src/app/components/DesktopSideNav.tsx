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

const navButtonClass = (isActive: boolean) => `group relative overflow-hidden rounded-xl h-10 w-10 flex items-center justify-center transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))] ${isActive ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.15)] ring-1 ring-[rgb(var(--color-primary-rgb))]/40 shadow-sm' : 'text-[rgb(var(--color-on-surface-muted-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))] hover:text-[rgb(var(--color-on-surface-rgb))]'}`;

export function DesktopSideNav({ active, highlightSettings = false, onSelectExtractor, onSelectImage, onOpenSettings }: DesktopSideNavProps) {
    return (
        <div className="hidden md:block flex-shrink-0 h-full bg-[rgb(var(--color-surface-alt-rgb))] border-r border-[rgb(var(--color-surface-border-rgb))]">
            <div className="flex flex-col h-full justify-center space-y-2 p-3">
                <TooltipWrapper tipContent="Tag Extractor">
                    <motion.button whileTap={{ scale: 0.96 }} onClick={onSelectExtractor} className={navButtonClass(active === 'extractor')} aria-label="Tag Extractor" aria-current={active === 'extractor' ? 'page' : undefined}>
                        <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity duration-200" />
                        <TagIcon />
                    </motion.button>
                </TooltipWrapper>
                <TooltipWrapper tipContent="Image Metadata">
                    <motion.button whileTap={{ scale: 0.96 }} onClick={onSelectImage} className={navButtonClass(active === 'image')} aria-label="Image Metadata" aria-current={active === 'image' ? 'page' : undefined}>
                        <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity duration-200" />
                        <PhotoIcon className="h-6 w-6" />
                    </motion.button>
                </TooltipWrapper>
                <div className="my-1 h-[1px] bg-[rgb(var(--color-surface-border-rgb))]" />
                <TooltipWrapper tipContent="Settings">
                    <motion.button whileTap={{ scale: 0.96 }} onClick={onOpenSettings} className={navButtonClass(!!highlightSettings)} aria-label="Settings">
                        <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity duration-200" />
                        <CogIcon />
                    </motion.button>
                </TooltipWrapper>
            </div>
        </div>
    );
}

export default DesktopSideNav;


