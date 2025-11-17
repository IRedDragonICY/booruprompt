"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { ArrowDownTrayIcon } from '../components/icons/icons';
import type { ActiveView } from '../types/settings';
import { useTranslation } from 'react-i18next';

interface MobileAppShellProps {
    active: ActiveView;
    selectExtractor: () => void;
    selectImage: () => void;
    selectBooruList: () => void;
    openSettings: () => void;
    highlightSettings?: boolean;

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

export function MobileAppShell({
    active,
    selectExtractor,
    selectImage,
    selectBooruList,
    openSettings,
    highlightSettings = false,
    isDraggingOverExtractor,
    isDraggingOverImage,
    onExtractorDragOver,
    onExtractorDragLeave,
    onExtractorDrop,
    onImageDragOver,
    onImageDragLeave,
    onImageDrop,
    children,
}: MobileAppShellProps) {
    const { t } = useTranslation();
    const dragHandlers = active === 'extractor'
        ? { onDragOver: onExtractorDragOver, onDragLeave: onExtractorDragLeave, onDrop: onExtractorDrop }
        : active === 'image'
            ? { onDragOver: onImageDragOver, onDragLeave: onImageDragLeave, onDrop: onImageDrop }
            : {};

    const containerClass = "relative z-10 flex w-full max-w-xl flex-col overflow-hidden pb-20 md:pb-0 min-h-screen";

    return (
        <>
             <div
                className={containerClass}
                style={{ minHeight: '100svh' }}
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
                                <p className="font-semibold">{t('common.dropOverlay.url')}</p>
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
                                <p className="font-semibold">{t('common.dropOverlay.png')}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {children}
            </div>

            <MobileBottomNav active={active} onSelectExtractor={selectExtractor} onSelectImage={selectImage} onSelectBooruList={selectBooruList} onOpenSettings={openSettings} highlightSettings={highlightSettings} />
        </>
    );
}

export default MobileAppShell;


