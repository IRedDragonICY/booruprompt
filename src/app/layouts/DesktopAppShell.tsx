"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import DesktopSideNav from '../components/DesktopSideNav';
import { ArrowDownTrayIcon } from '../components/icons/icons';

import type { ActiveView } from '../types/settings';

interface DesktopAppShellProps {
    active: ActiveView;
    highlightSettings?: boolean;
    selectExtractor: () => void;
    selectImage: () => void;
    openSettings: () => void;

    isDraggingOverExtractor: boolean;
    isDraggingOverImage: boolean;

    onExtractorDragOver: React.DragEventHandler<HTMLDivElement>;
    onExtractorDragLeave: React.DragEventHandler<HTMLDivElement>;
    onExtractorDrop: React.DragEventHandler<HTMLDivElement>;

    onImageDragOver: React.DragEventHandler<HTMLDivElement>;
    onImageDragLeave: React.DragEventHandler<HTMLDivElement>;
    onImageDrop: React.DragEventHandler<HTMLDivElement>;

    children: React.ReactNode;
}

export function DesktopAppShell({
    active,
    highlightSettings = false,
    selectExtractor,
    selectImage,
    openSettings,
    isDraggingOverExtractor,
    isDraggingOverImage,
    onExtractorDragOver,
    onExtractorDragLeave,
    onExtractorDrop,
    onImageDragOver,
    onImageDragLeave,
    onImageDrop,
    children,
}: DesktopAppShellProps) {
    const dragHandlers = active === 'extractor'
        ? { onDragOver: onExtractorDragOver, onDragLeave: onExtractorDragLeave, onDrop: onExtractorDrop }
        : { onDragOver: onImageDragOver, onDragLeave: onImageDragLeave, onDrop: onImageDrop };

    return (
        <div className="flex items-start md:flex-row flex-col mx-auto relative">
            <DesktopSideNav
                active={active}
                highlightSettings={highlightSettings}
                onSelectExtractor={selectExtractor}
                onSelectImage={selectImage}
                onOpenSettings={openSettings}
            />

            <div
                className="relative z-10 flex w-full max-w-xl flex-col overflow-hidden pb-0"
                {...dragHandlers}
            >
                <AnimatePresence>
                    {isDraggingOverExtractor && active === 'extractor' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center border-2 border-dashed border-[rgb(var(--color-primary-rgb))] bg-[rgb(var(--color-primary-rgb))]/20 backdrop-blur-xs"
                        >
                            <div className="rounded-lg bg-[rgb(var(--color-primary-rgb))]/80 px-4 py-2 text-center text-[rgb(var(--color-primary-content-rgb))] shadow-sm">
                                <ArrowDownTrayIcon className="mx-auto mb-1 h-8 w-8" />
                                <p className="font-semibold">Drop URL</p>
                            </div>
                        </motion.div>
                    )}
                    {isDraggingOverImage && active === 'image' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center border-2 border-dashed border-[rgb(var(--color-primary-rgb))] bg-[rgb(var(--color-primary-rgb))]/20 backdrop-blur-xs"
                        >
                            <div className="rounded-lg bg-[rgb(var(--color-primary-rgb))]/80 px-4 py-2 text-center text-[rgb(var(--color-primary-content-rgb))] shadow-sm">
                                <ArrowDownTrayIcon className="mx-auto mb-1 h-8 w-8" />
                                <p className="font-semibold">Drop PNG</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {children}
            </div>
        </div>
    );
}

export default DesktopAppShell;


